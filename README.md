# Sry.lol / 嘴替游乐场

> **30 秒挑人设的嘴替游乐场。**
> 输入你闯的祸,挑你今晚的人设。5 种面具任选 1 封草稿。
> 发不发随你(我们不管,也不想知道)。

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](#)
[![Deploy](https://img.shields.io/badge/deploy-live-brightgreen)](https://sry-web.pages.dev/)

---

## 这是什么

**Sry.lol** 是一个纯客户端的"嘴替游乐场"——你在表单里挑个场景 + 选个人设,5 封草稿立刻出来,挑一封会心一笑的,**复制走人**。

不是严肃工具。是 30 秒里让你笑一下的小玩意儿。

> 脚注:不替你发。我们不持久化你的输入,也不想知道你发给了谁。

- **Live demo**: [sry-web.pages.dev](https://sry-web.pages.dev/) (无需注册,无需 key,纯前端)
- **Source code**: [github.com/kevin12369/sry](https://github.com/kevin12369/sry)

---

## 5 种人设(每种都有 6 种场景)

| 人设 | 一句话 | emoji |
|------|--------|-------|
| 搞笑 | 朋友圈段子手写给你 | 😂 |
| 真诚 | 你妈看了会内疚 | 🤝 |
| 耍赖 | 死猪不怕开水烫 | 🤡 |
| 法务冷面 | 一份严肃的免责声明 | 📜 |
| 已读不回 | 真的没回(也没打算回) | 👻 |

**6 种场景**:道歉 / 感谢 / 拒绝 / 表白 / 辞职 / 撕逼。`5 风格 × 6 场景 = 30 种组合`,每种都有 1 句损友点评。

---

## 怎么跑

```bash
# 1. 装依赖
pnpm install

# 2. 起本地
pnpm dev:web
# -> http://localhost:3000

# 3. 跑测试(共 25 项)
pnpm test

# 4. 构建静态站点
pnpm build:web
# -> ./apps/web/out

# 5. 部署到 Cloudflare Pages
pnpm deploy:web
```

无需 Worker、无需 KV、无需 API key。**PR #1 阶段用 5 封预设范文兜底**(PR #2 之后可粘贴 OAI 兼容 LLM key,例如本地 Ollama)。

---

## 技术栈

| 层级 | 选型 |
|------|------|
| 前端 | Next.js 14 App Router + 静态导出 |
| 部署 | Cloudflare Pages |
| 数据 | 5 × 6 prompt table + 5 封预设范文 + 30 句损友点评 |
| 状态 | 4 状态机(idle / composing / ready / error) |
| 分享 | URL hash base64(1 封 + AI 损友点评) |
| 测试 | Vitest + Testing Library |

---

## 项目结构(PR #1)

```
projects/sry/
├─ apps/
│  └─ web/                # Next.js 14 静态导出
│     ├─ src/
│     │  ├─ app/         # page / settings / portfolio
│     │  ├─ components/  # SceneForm / LetterStack / LetterPage / Envelope / HandwrittenLogo
│     │  ├─ data/        # prompts / roasts / sample-letters
│     │  ├─ hooks/       # useGenerate / useSettings / useShare
│     │  └─ lib/         # share / state-machine / storage / tokens / mapping / wordCount
│     └─ tests/          # 25 项关键测试
└─ packages/
   └─ shared/             # 5 风格 + 3 性格 types + zod schema
```

> **PR #1 完全砍掉 `apps/worker/`**(原 Cloudflare Worker LLM 代理 + 3 层护栏 + KV 配额 + 6 LLM provider 适配)。

---

## PR 路线图

- [x] **PR #1**:砍后端 + 5 风格纯客户端(5 封预设范文 + URL hash 改分享 + 4 状态机) ← 当前
- [ ] PR #2:浏览器 OAI 兼容 LLM 接入 + 简化 BYOK
- [ ] PR #3:5 个"好玩"新元素(SPIN 转盘 + AI 损友扩列 + 已读不回动画 + Share-as-meme)
- [ ] PR #4:8 段宣传页 v2(Hero + Status + Features + BeforeAfter + Who + RunLocally + FAQ + Roadmap)

---

## 反馈

发邮件:491750329@qq.com
提 issue:github.com/kevin12369/sry/issues

提 issue 的话最有用的信息:
- 你选了哪个场景 + 哪个风格
- 你期望它怎么写
- 5 封里哪封最像"它想说的"哪封最不像

> *好玩 > 严肃。这项目是 5 项目重构里的第 2 个,前一个是 Hummingbird v2(纯静态 + 浏览器直连)验证可行。*
