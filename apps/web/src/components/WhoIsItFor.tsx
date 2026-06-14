interface Persona {
  emoji: string;
  title: string;
  quote: string;
  description: string;
}

const PERSONAS: Persona[] = [
  {
    emoji: '🌱',
    title: '轻度社恐',
    quote: '我发消息前要纠结 1 小时,选我应该用什么语气',
    description: '5 风格面具帮你快速决定今晚的语气,不用纠结 1 小时。',
  },
  {
    emoji: '🎨',
    title: '朋友圈梗图贡献者',
    quote: '我需要"我画的 vs AI 画的"类型对比,生成梗图',
    description: '5 风格对比 + AI 损友点评本身就是梗,截屏就能发。',
  },
  {
    emoji: '📱',
    title: '短视频博主',
    quote: '我录"我让 AI 帮我道歉"系列,需要 5 风格对比',
    description: '5 风格 × 6 场景 = 30 种组合,内容素材源源不断。',
  },
];

// PR #4 + PR #1 P0: 3 画像 - 谁能从这个产品得到价值
// PR #1:emoji 锁 40px w-10 h-10,padding 改 p-5 md:p-6,persona min-height 200
export function WhoIsItFor() {
  return (
    <section
      aria-labelledby="who-title"
      data-section="who"
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <h2
        id="who-title"
        className="text-2xl md:text-3xl font-bold text-ink text-center mb-8"
      >
        这玩意儿给谁用
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PERSONAS.map((p, idx) => (
          <article
            key={p.title}
            data-persona={idx + 1}
            className="rounded-paper border border-[#d4b896] bg-cream p-5 md:p-6 shadow-paper flex flex-col min-h-[200px]"
          >
            <div className="text-4xl w-10 h-10 flex items-center justify-center mb-2" aria-hidden="true">{p.emoji}</div>
            <h3 className="text-base font-bold text-ink">{p.title}</h3>
            <blockquote className="mt-2 text-xs italic text-seal border-l-2 border-seal pl-2">
              &ldquo;{p.quote}&rdquo;
            </blockquote>
            <p className="mt-3 text-xs text-ink/80 leading-relaxed flex-1">
              {p.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}