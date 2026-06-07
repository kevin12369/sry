#!/usr/bin/env bash
set -e
BASE="${BASE:-http://127.0.0.1:8787}"

echo "→ /api/health"
curl -fsS "$BASE/api/health" | tee /tmp/health.json
echo

echo "→ /api/gen (happy path)"
curl -fsS -X POST "$BASE/api/gen" \
  -H 'content-type: application/json' \
  -d '{"situation":"我把室友的猫放跑了,他很生气","personality":"direct"}' \
  | tee /tmp/gen.json
echo

echo "→ /api/gen (real-person rejection)"
curl -sS -o /tmp/rej.json -w "%{http_code}\n" -X POST "$BASE/api/gen" \
  -H 'content-type: application/json' \
  -d '{"situation":"我要弄死王伟","personality":"cold"}'
cat /tmp/rej.json
