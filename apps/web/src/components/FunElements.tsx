interface FunCard {
  emoji: string;
  title: string;
  desc: string;
  placeholder: string;
}

const CARDS: FunCard[] = [
  {
    emoji: '🎲',
    title: 'SPIN 选人设',
    desc: '不选风格,点 SPIN,转盘随机命中 1 个。看看今晚你当什么人。',
    placeholder: '转盘截图(占位)',
  },
  {
    emoji: '🤖',
    title: 'AI 损友点评',
    desc: '"这封能让你妈感动 0.5 秒" / "这封能让对方请律师" —— 调侃但不过分。',
    placeholder: '损友点评截图(占位)',
  },
  {
    emoji: '🎭',
    title: '6 场景',
    desc: '道歉 / 感谢 / 拒绝 / 表白 / 辞职 / 撕逼 —— 不只道歉,场景扩列降低使用门槛。',
    placeholder: '场景下拉截图(占位)',
  },
  {
    emoji: '📤',
    title: 'Share-as-meme',
    desc: '分享"我闯的祸 + 1 封最离谱的 + AI 评语",截屏就能发朋友圈 / 小红书 / 微博。',
    placeholder: '分享卡片截图(占位)',
  },
  {
    emoji: '👻',
    title: '已读不回动画',
    desc: '选"已读不回"风格时,3 秒"对方已读"动画,然后显示"对方没回"。',
    placeholder: '已读不回动画截图(占位)',
  },
];

// PR #4 + PR #1 P0: 5 个好玩元素段 - 5 卡片网格
// PR #1:emoji 锁 40px w-10 h-10,fun_card min-height 240
export function FunElements() {
  return (
    <section
      aria-labelledby="fun-elements-title"
      data-section="fun-elements"
      className="max-w-6xl mx-auto px-4 py-16 md:py-20"
    >
      <h2
        id="fun-elements-title"
        className="text-2xl md:text-3xl font-bold text-ink text-center mb-3"
      >
        5 个好玩的小东西
      </h2>
      <p className="text-center text-sm text-ink/70 mb-8">
        AI 不只当仆人,这次让它当你的损友。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c, idx) => (
          <article
            key={c.title}
            data-fun-card={idx + 1}
            className="rounded-paper border border-[#d4b896] bg-cream p-5 shadow-paper flex flex-col min-h-[240px]"
          >
            <div className="text-4xl w-10 h-10 flex items-center justify-center mb-2 leading-none" aria-hidden="true">{c.emoji}</div>
            <h3 className="text-base font-bold text-ink">{c.title}</h3>
            <p className="mt-2 text-xs text-ink/80 leading-relaxed flex-1">{c.desc}</p>
            <div
              role="img"
              aria-label={c.placeholder}
              data-screenshot-placeholder
              className="mt-3 h-24 rounded border border-dashed border-[#c9a98d] bg-paper/60 flex items-center justify-center text-[10px] text-muted"
            >
              {c.placeholder}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}