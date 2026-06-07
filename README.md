# 嘴笨助手 (Sry)

> **做嘴笨助手,不做道歉信发送器。** Build an apology assistant, not an apology-letter sender.

A weekend MVP that turns "I want to apologize but I don't know what to say" into 5 stylistically distinct drafts you can pick from in 30 seconds.

- `apps/web` — Next.js 14 (App Router, static export) → Cloudflare Pages
- `apps/worker` — Cloudflare Worker (LLM proxy + 3-layer ethics guard) → Cloudflare Workers
- `packages/shared` — types + zod schemas shared by both

See `docs/design/2026-06-07-ai-apology-letter-design.md` for the full design.

## Local dev

```bash
pnpm install
pnpm dev:web      # http://localhost:3000
pnpm dev:worker   # http://localhost:8787
```
