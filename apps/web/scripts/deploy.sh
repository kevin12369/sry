#!/usr/bin/env bash
# Deploy the static export in ./out to Cloudflare Pages.
#
# Prereqs (run once, manually, the first time):
#   1. pnpm exec wrangler login
#   2. pnpm exec wrangler pages project create sry-web --production-branch main
#
# Usage:
#   # default: builds first using the env var, then deploys
#   NEXT_PUBLIC_API_BASE=https://sry-worker.<subdomain>.workers.dev ./scripts/deploy.sh
#
#   # skip the build (already built):
#   ./scripts/deploy.sh --skip-build
#
# This script does NOT auto-login. If wrangler auth is missing it will fail
# loudly with a hint.

set -euo pipefail

# Resolve repo root (apps/web -> ../..) so we work from the web app dir.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WEB_DIR"

PROJECT_NAME="${SRY_PAGES_PROJECT:-sry-web}"
SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=1 ;;
    --help|-h)
      sed -n '2,18p' "$0"
      exit 0
      ;;
    *) echo "Unknown arg: $arg" >&2; exit 2 ;;
  esac
done

if [ "$SKIP_BUILD" -eq 0 ]; then
  echo "-> Building static export (NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE:-<unset>})"
  : "${NEXT_PUBLIC_API_BASE:?Set NEXT_PUBLIC_API_BASE to your worker URL before building (e.g. https://sry-worker.<sub>.workers.dev)}"
  pnpm run build
fi

if [ ! -f "$WEB_DIR/out/index.html" ]; then
  echo "ERROR: $WEB_DIR/out/index.html missing. Run the build first (drop --skip-build)." >&2
  exit 1
fi

echo "-> Deploying ./out to Cloudflare Pages project '$PROJECT_NAME'"
pnpm exec wrangler pages deploy ./out --project-name="$PROJECT_NAME"
