#!/usr/bin/env bash
# e2e.sh — Smoke test the live Sry deployment
#
# Verifies:
#   1. CORS preflight from frontend origin passes against the Worker
#   2. GET /api/health returns ok
#   3. POST /api/gen returns 5 letters on a happy-path request
#   4. POST /api/gen returns 422 on a real-person + threat-word request
#   5. Frontend Pages deployment returns 200 with the new redesigned UI
#
# Usage:
#   # against the deployed Worker + Pages:
#   ./scripts/e2e.sh
#
#   # against local dev (pnpm dev:worker + pnpm dev:web):
#   BASE_WORKER=http://127.0.0.1:8787 BASE_PAGES=http://localhost:3000 \
#     ./scripts/e2e.sh
#
# Requires: curl, jq (optional, falls back to grep on raw JSON).

set -euo pipefail

WORKER="${BASE_WORKER:-https://sry-worker.491750329.workers.dev}"
PAGES="${BASE_PAGES:-https://sry-web.pages.dev}"
FRONTEND_ORIGIN="${FRONTEND_ORIGIN:-https://sry-web.pages.dev}"

step() { echo ""; echo "─── $1 ───"; }
ok()   { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; exit 1; }

# 1. CORS preflight (cross-origin from frontend to worker)
step "1. CORS preflight"
PREFLIGHT=$(curl -sS -i -X OPTIONS "$WORKER/api/gen" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,x-model,x-api-key" \
  | tr -d '\r')
echo "$PREFLIGHT" | head -10
echo "$PREFLIGHT" | grep -qi "^HTTP/.* 200" || fail "preflight did not return 200"
echo "$PREFLIGHT" | grep -qi "^access-control-allow-origin:" || fail "preflight missing ACAO header"
ok "preflight passes CORS for $FRONTEND_ORIGIN"

# 2. Health check
step "2. GET /api/health"
HEALTH=$(curl -fsS "$WORKER/api/health")
echo "  $HEALTH"
echo "$HEALTH" | grep -q '"ok":true' || fail "health did not return ok:true"
ok "health ok"

# 3. Happy-path generation
step "3. POST /api/gen (happy path)"
GEN=$(curl -fsS -X POST "$WORKER/api/gen" \
  -H "content-type: application/json" \
  -d '{"situation":"我把室友的猫放跑了,他很生气","personality":"direct"}')
echo "  $GEN" | head -c 400; echo "..."
for k in funny sincere shameless legal-cold silent-treatment; do
  echo "$GEN" | grep -q "\"$k\":\"" || fail "missing style '$k' in response"
done
ok "all 5 styles present"

# 4. Ethics guard — real-person + threat-word → 422
step "4. POST /api/gen (ethics: 弄死 + 真人)"
HTTP_CODE=$(curl -sS -o /tmp/sry_rej.json -w "%{http_code}" -X POST "$WORKER/api/gen" \
  -H "content-type: application/json" \
  -d '{"situation":"我要弄死王伟","personality":"cold"}')
echo "  HTTP $HTTP_CODE: $(cat /tmp/sry_rej.json)"
[ "$HTTP_CODE" = "422" ] || fail "expected 422 for ethics rejection, got $HTTP_CODE"
grep -q '"error"' /tmp/sry_rej.json || fail "missing error field in rejection"
ok "ethics guard returns 422"

# 5. Frontend Pages deployment
step "5. GET $PAGES (Pages deployment)"
HTML=$(curl -fsS "$PAGES/")
echo "$HTML" | grep -q '嘴笨助手' || fail "frontend missing '嘴笨助手' (new UI not deployed?)"
echo "$HTML" | grep -q '发生了什么' || fail "frontend missing '发生了什么' (ChatStep 1 not rendered?)"
ok "frontend renders new UI"

echo ""
echo "✅ e2e all 5 steps passed"
echo "   Worker: $WORKER"
echo "   Pages:  $PAGES"
