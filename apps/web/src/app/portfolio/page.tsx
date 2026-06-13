import type { Metadata } from 'next';
import Link from 'next/link';

const NAME = '嘴笨助手 · Sry';
const TAGLINE = '5 种风格的道歉信生成器';
const DESCRIPTION =
  '你得罪了一个人,要发消息道歉,但嘴笨不知道怎么说?Sry 让你在表单里描述"发生了什么"和"对方性格",AI 一次给你 5 种风格挑一封——搞笑、真诚、耍赖、法务冷面、已读不回。30 秒选一封能发出去的,心理摩擦消失。';
const GITHUB_URL = 'https://github.com/kevin12369/sry';
const DEMO_URL = 'https://sry-web.pages.dev/';

export const metadata: Metadata = {
  title: `${NAME} — Portfolio`,
  description: DESCRIPTION,
};

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6 max-w-3xl mx-auto flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold">{NAME}</h1>
        <p className="text-muted mt-1">{TAGLINE}</p>
      </header>

      <section className="rounded border border-zinc-300 overflow-hidden bg-white">
        <img
          src="/docs/img/main.png"
          alt={`${NAME} demo screenshot`}
          className="w-full h-auto"
        />
      </section>

      <section className="prose prose-zinc max-w-none">
        <p>{DESCRIPTION}</p>

        <h2>What you can do here</h2>
        <ul>
          <li>在 4 步对话里填"我做了什么"和"对方性格",LLM 一次出 5 封差异化道歉信</li>
          <li>5 风格视觉差异明显(搞笑 = 哈哈,真诚 = 真心,耍赖 = 油嘴,法务 = 公文,已读不回 = 装死)</li>
          <li>"信封堆叠"交互:5 封牛皮纸信封排开,点开看信纸,左/右切上一封/下一封</li>
          <li>3 层伦理护栏:长度校验 + 50 姓氏×恶意词共现 + IP 限流,拒绝恶意输入</li>
          <li>URL hash 分享:把 5 封信 base64 编码到 URL,朋友投票"哪封最合适"——零服务端存储</li>
          <li>BYOK 升级:自带 Claude Haiku / Gemini Flash / OpenAI key,质量更好</li>
        </ul>

        <h2>How to run it for real</h2>
        <p>Live demo 默认走 Cloudflare Workers AI Llama 3.1 8B(免费),打开就能用。需更高质量时可在 /settings 里切 Claude/Gemini(自备 key)。</p>
        <ul>
          <li>
            See{' '}
            <Link href="/docs/RUN-LOCALLY.md">/docs/RUN-LOCALLY.md</Link> for the
            1-page clone-and-run guide.
          </li>
          <li>
            Or{' '}
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              browse the source on GitHub
            </a>
            .
          </li>
        </ul>

        <h2>Other projects in this portfolio</h2>
        <ul>
          <li>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              嘴笨助手 Sry
            </a>{' '}
            — 5 风格道歉信生成器(就是本页项目)
          </li>
          <li>
            <a
              href="https://github.com/kevin12369/whimsy"
              target="_blank"
              rel="noopener noreferrer"
            >
              一念成游 Whimsy
            </a>{' '}
            — AI 2D 小游戏生成器
          </li>
          <li>
            <a
              href="https://github.com/kevin12369/hummingbird"
              target="_blank"
              rel="noopener noreferrer"
            >
              哼哼编曲 Hummingbird
            </a>{' '}
            — 哼唱→MIDI 编曲
          </li>
        </ul>
      </section>

      <footer>
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Back to demo
        </Link>
      </footer>
    </main>
  );
}
