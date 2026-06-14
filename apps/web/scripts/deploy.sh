#!/usr/bin/env bash
# Deploy the static export in ./out to Cloudflare Pages.
#
# Prereqs (run once, manually, the first time):
#   1. pnpm exec wrangler login
#   2. pnpm exec wrangler pages project create sry-web --production-branch main
#
# Usage:
#   ./scripts/deploy.sh
#   ./scripts/deploy.sh --skip-build

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WEB_DIR"

PROJECT_NAME="${SRY_PAGES_PROJECT:-sry-web}"
SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=1 ;;
    --help|-h)
      sed -n '2,16p' "$0"
      exit 0
      ;;
    *) echo "Unknown arg: $arg" >&2; exit 2 ;;
  esac
done

if [ "$SKIP_BUILD" -eq 0 ]; then
  echo "-> Building static export (Sry.lol — no backend)"
  pnpm run build
fi

if [ ! -f "$WEB_DIR/out/index.html" ]; then
  echo "ERROR: $WEB_DIR/out/index.html missing. Run the build first (drop --skip-build)." >&2
  exit 1
fi

echo "-> Deploying ./out to Cloudflare Pages project '$PROJECT_NAME'"
pnpm exec wrangler pages deploy ./out --project-name="$PROJECT_NAME"
