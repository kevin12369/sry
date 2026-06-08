# 嘴笨助手 (Sry)

> **做嘴笨助手,不做道歉信发送器。** Build an apology assistant, not an apology-letter sender.

A weekend MVP that turns "I want to apologize but I don't know what to say" into 5 stylistically distinct drafts you can pick from in 30 seconds.

## Architecture
- `apps/web` — Next.js 14 (App Router, static export) → Cloudflare Pages
- `apps/worker` — Cloudflare Worker (LLM proxy + 3-layer ethics guard) → Cloudflare Workers
- `packages/shared` — types + zod schemas shared by both

Zero backend persistence: the Worker only stores rate-limit / quota counters in Workers KV (no PII). Share links are URL hashes.

## Local dev

```bash
pnpm install
pnpm dev:worker   # http://127.0.0.1:8787
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8787 pnpm dev:web   # http://localhost:3000
```

## Tests

```bash
pnpm test
```

## Deploy

```bash
pnpm deploy:worker    # wrangler deploy
pnpm deploy:web       # wrangler pages deploy ./out --project-name=sry-web
```

## Resume bullets (from `docs/design/2026-06-07-ai-apology-letter-design.md` section 11)
- 设计 5 套手调 Prompt 模板(搞笑 / 真诚 / 厚脸皮 / 法律冷面 / 已读不回),Claude 3.5 Haiku 驱动
- 落地页 + Worker 代理 LLM API,5 路并发生成,5 卡片并排对比 UI,URL hash 零后端分享
- 设计 3 层伦理护栏(关键词黑名单 + 真人姓名共现检测 + IP rate-limit),强 disclaimer + 永不代发
