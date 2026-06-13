# Run 嘴笨助手 Sry locally

5 steps. ~10 min total. **No local LLM needed** — Sry uses Cloudflare Workers AI by default (free Llama 3.1 8B), no Ollama/LM Studio setup required.

## 1. Prerequisites

- Node.js 20+
- pnpm 9+ (`npm i -g pnpm`)
- A Cloudflare account (only needed if you want to deploy; for local dev, the Worker hits a public demo endpoint)

## 2. Clone

```bash
git clone https://github.com/kevin12369/sry.git
cd sry
```

## 3. Install

```bash
pnpm install
```

## 4. Configure LLM

**Skip this step.** Sry uses Cloudflare Workers AI (Llama 3.1 8B, free tier) by default — no local model setup needed.

To switch providers or BYOK, open `http://localhost:3000/settings` after `pnpm dev:web` and pick:

- **Cloudflare Workers AI** (default, free) — no key
- **Google Gemini Flash** (free) — paste your API key
- **Anthropic Claude Haiku** (best quality) — paste your API key

## 5. Run

```bash
# Terminal 1: Cloudflare Worker (LLM proxy + ethics guard) at :8787
pnpm dev:worker

# Terminal 2: Next.js web at :3000
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8787 pnpm dev:web
# open http://localhost:3000
```

## What you'll see

- A live demo of 嘴笨助手 Sry — describe what you did, pick the recipient's personality, and 5 styled apology letters appear (搞笑 / 真诚 / 耍赖 / 法务冷面 / 已读不回)
- All 83 tests pass (`pnpm test` to re-run — 6 shared + 49 worker + 28 web)
- TypeScript strict (`pnpm -r exec tsc --noEmit`)

## Need help?

- Issues: <https://github.com/kevin12369/sry/issues>
- Email: 491750329@qq.com
