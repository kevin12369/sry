import type { Metadata } from 'next';
import Link from 'next/link';
import { STYLES, STYLE_NAMES_ZH, STYLE_EMOJI, SCENES, SCENE_NAMES_ZH } from '@/data/prompts';

const NAME = 'Sry.lol · 嘴替游乐场';
const TAGLINE = '30 秒挑人设的嘴替游乐场';
const DESCRIPTION =
  '输入你闯的祸,挑你今晚的人设。5 种面具任选 1 封草稿,发不发随你(我们不管,也不想知道)。';
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

        <h2>5 种人设</h2>
        <ul>
          {STYLES.map((s) => (
            <li key={s}>{STYLE_EMOJI[s]} <strong>{STYLE_NAMES_ZH[s]}</strong></li>
          ))}
        </ul>

        <h2>6 种场景</h2>
        <ul>
          {SCENES.map((s) => (
            <li key={s}>{SCENE_NAMES_ZH[s]}</li>
          ))}
        </ul>

        <h2>How it works</h2>
        <ul>
          <li>纯客户端 0 后端,5 封预设范文兜底(PR #1)</li>
          <li>URL hash 分享:1 封最离谱的 + 损友点评 1 行</li>
          <li>PR #2 之后:浏览器 OAI 兼容 LLM 接入,BYOK 模式</li>
        </ul>

        <h2>How to run it for real</h2>
        <ul>
          <li>Live: <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">sry-web.pages.dev</a></li>
          <li>Source: <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">github.com/kevin12369/sry</a></li>
        </ul>

        <h2>Other projects</h2>
        <ul>
          <li><a href="https://github.com/kevin12369/whimsy" target="_blank" rel="noopener noreferrer">一念成游 Whimsy</a> — AI 2D 小游戏生成器</li>
          <li><a href="https://github.com/kevin12369/hummingbird" target="_blank" rel="noopener noreferrer">哼哼编曲 Hummingbird</a> — 哼唱→MIDI 编曲</li>
        </ul>
      </section>

      <footer>
        <Link href="/" className="text-sm text-muted hover:text-ink">← Back to demo</Link>
      </footer>
    </main>
  );
}
