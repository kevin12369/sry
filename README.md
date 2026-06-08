# 嘴笨助手 · Sry

> **道歉这件难开口的事,让 AI 帮你起个稿。/ When "sorry" is hard, AI drafts the words.**

[![Status](https://img.shields.io/badge/status-MVP_shipped-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)
[![Stack](https://img.shields.io/badge/stack-Cloudflare_Workers-F38020?logo=cloudflare)](#)

---

## ✨ 这个想法

你得罪了一个人,要发消息道歉。但**你嘴笨,不知道怎么说**——脑子里想了一百遍措辞,手指悬在键盘上,一小时过去还是没发出去。

**让 AI 给你 5 种风格挑一封**。搞笑版 / 真诚版 / 耍赖版 / 法务冷面版 / 已读不回版。30 秒选一封能发出去的,**心理摩擦消失**。

> ⚠️ 不替你发——**只帮你起稿,发送动作你来做**。

---

## 🎯 这件事有意思在哪

**道歉是人类的硬需求,但 AI 之前没人认真做过**。市面上有"AI 写作助手"但都是通用写作——没人**专门**研究"怎么把道歉信写得既有风格又让对方真的能接受"。

更细的:**5 种风格的对比**让用户能"挑一个适合对方性格的"——同一件事,面对冷淡的人用 direct 风格,面对敏感的人用 sincere 风格。AI 不是在"写"道歉信,是在**"在 5 种人格面具里选"**。

伦理边界很微妙但**值得做**:**不代发、不缓存输入、不针对真人姓名**。设计"draft"不是"send"——这条线是这条项目存在的理由。

---

## 🚀 想要实现的样子

- 📝 用户在表单填"我做了什么" + "对方性格" → 5 封信并排展示
- 🎭 5 种风格视觉差异明显(搞笑 = 😂,真诚 = 🤝,耍赖 = 🤡,法务 = 📜,已读不回 = 👻)
- 🔀 5 封卡片可按"按风格 / 按长度"排序
- 📋 任一封可"复制" + "换一版"
- 🔗 5 封可"URL hash 分享"——给朋友看"我准备这样道歉,你帮我挑"
- 🛡️ 拒绝恶意输入(姓名+威胁词共现)→ 友好降级,不报错

> 🚧 伦理护栏常驻顶部 banner:**"做嘴笨助手,不做道歉信发送器"**。

---

## 🔮 未来可能拓展成什么

- **📨 更多场景**:不只道歉,还有"感谢信"/"拒绝信"/"表白信"/"辞职信"——同套 5 风格架构
- **🌍 多语言**:英文 / 日文 / 韩文(LLM 跨语言不错,只需 prompt 模板)
- **🎙️ 语音输入 + TTS 朗读**:用户说"我做了什么",AI 总结;输出 5 封信也能朗读
- **🎓 "AI 道歉教练"**:告诉用户"为什么真诚版比耍赖版更适合这个场景",加教育价值
- **🗳️ 多人投票**:URL hash 分享时,朋友能投票"我觉得用 sincere 版"

---

## 🛠️ 技术栈

| 层级 | 选型 |
|------|------|
| 🎨 前端 | Next.js 14(App Router, `output: 'export'`) |
| ☁️ 后端 | Cloudflare Workers + KV(限流 + 配额) |
| 🤖 LLM | Workers AI Llama 3.1 8B(默认,免费)/ Gemini Flash(免费)/ Claude Haiku(BYOK 升级,质量最好) |
| 📝 Prompt 模板 | 5 个手调 3 段式 `[Role] + [Constraints] + [Output Format]` |
| 🛡️ 伦理护栏 | 3 层:长度校验 + 50 姓氏 × 恶意词共现 + IP 限流 |
| 🔗 匿名分享 | URL-safe base64 编码到 hash,服务端零存储 |
| 🔒 隐私 | 零持久化(用户输入不进任何存储,连日志都不记) |

---

## 📋 To-do

- [x] 写 Next.js 前端(form + 5 卡片 + 分享 + 设置)
- [x] 写 Worker LLM 编排(5 路并发 + 8s timeout + sanitize)
- [x] 写 3 层伦理护栏
- [x] 写 5 个手调 prompt 模板
- [x] 写 URL hash 分享
- [x] 写 BYOK 设置(API key + 模型选择)
- [x] 写 quota 硬墙(KV 计数 + kill switch)
- [x] 写 deploy 脚本
- [x] 写 Cloudflare Web Analytics 集成
- [x] 写 README polish

---

## 🤝 欢迎词

开源 + 公开 portfolio。

如果你:

- 😐 **试用了,5 封信全是套话** → 提 issue,贴 situation,我会重写 prompt
- 🎭 **5 风格区分度不够** → 提 issue,带 "style" 标签,**重点讨论**
- 🐛 **发现了伦理护栏漏过** → 提 issue,标 "ethics",**优先修**
- ➕ **想加新风格** (含蓄 / 撒娇 / 黑色幽默)→ 提 PR,附 system prompt
- ➕ **想加新场景** (感谢信 / 拒绝信)→ 提 PR
- 💪 **就是个真人,想给作者说"加油"** → 提 issue 带 "encouragement" 标签,我收

**提交 issue**:[github.com/kevin12369/sry/issues](https://github.com/kevin12369/sry/issues)
**发邮件**:491750329@qq.com

### 💡 特别欢迎

- 🤖 LLM prompt 工程师(帮我看 5 风格 prompt 调优)
- ⚖️ 伦理 AI 设计师(帮我看护栏设计)
- 🇨🇳 中文 NLP 研究者(中文微妙语气的 prompt 表达)

---

## 🌟 项目亮点

**做了什么**

- 5 套手调 Prompt 模板(搞笑 / 真诚 / 耍赖 / 法务冷面 / 已读不回),驱动 LLM 一次出 5 封差异化道歉信
- Next.js 14 静态导出 + Cloudflare Worker:5 路并发 LLM 编排、`Promise.allSettled` + 8s/style timeout、Worker KV 滑窗限流
- 3 层伦理护栏(关键词黑名单 + 50 姓氏×恶意词共现 + IP rate-limit),强 disclaimer + 永不代发 + 零输入持久化
- 客户端优先 + URL hash base64 分享(零服务端存储),5 封信"信封堆叠"交互,5 视图状态机(对话 / 信堆 / 信纸 / 分享 / 拒绝)

**怎么做到的**

- `apps/web` — Next.js 14(App Router, `output: 'export'`) → Cloudflare Pages
- `apps/worker` — Cloudflare Worker(LLM 代理 + 3 层伦理护栏)→ Cloudflare Workers
- `packages/shared` — types + zod schemas,前后端共用
- 0 后端持久化:Worker 只在 KV 存限流/配额计数(无 PII),分享链接走 URL hash
- 5 封信"信封堆叠"交互,牛皮纸纹理 + 火漆/邮戳/邮票 SVG 视觉,**0 web font**(系统字体栈)

**跑起来的数字**

- 128 测试通过(6 shared + 79 worker + 43 web)
- TypeScript strict 干净,First Load JS 108 kB
- 部署在 [sry-web.pages.dev](https://sry-web.pages.dev) + [sry-worker.491750329.workers.dev](https://sry-worker.491750329.workers.dev)

**本地开发**

```bash
pnpm install
pnpm dev:worker   # http://127.0.0.1:8787
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8787 pnpm dev:web   # http://localhost:3000
```

**测试 + e2e**

```bash
pnpm test          # 128 tests
pnpm e2e           # 验证 live 部署: CORS / health / gen / ethics / Pages
```

**部署**

```bash
pnpm deploy:worker   # wrangler deploy
pnpm deploy:web      # wrangler pages deploy ./out --project-name=sry-web
```

---

> *这项目代码已经写完 100%,54 个 task 全部 commit。是我 5 个项目里第一个完整跑通到 deploy 的。*
