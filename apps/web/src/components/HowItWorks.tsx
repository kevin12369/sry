interface Step {
  num: number;
  title: string;
  desc: string;
  duration: string;
}

const STEPS: Step[] = [
  {
    num: 1,
    title: '选场景 + 写情境',
    desc: '6 场景选 1 个(道歉 / 感谢 / 拒绝 / 表白 / 辞职 / 撕逼),把情境写清楚(5-300 字)。',
    duration: '~5s',
  },
  {
    num: 2,
    title: '选风格 OR 点 SPIN',
    desc: '5 风格选 1,或者直接点 SPIN 让转盘帮你选。',
    duration: '~3s',
  },
  {
    num: 3,
    title: '拿 1 封草稿 + 1 行损友点评',
    desc: '预设范文(默认兜底)OR LLM 实时生成。每封信附 1 行 AI 损友点评。',
    duration: '~3s',
  },
];

// PR #4: 3 步流程(简化版,因为只有 3 步)
// 总时长:11 秒(比 Hummingbird 27 秒快)
export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-title"
      data-section="how-it-works"
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <h2
        id="how-it-works-title"
        className="text-2xl md:text-3xl font-bold text-ink text-center mb-8"
      >
        3 步搞定,11 秒出稿
      </h2>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 list-none">
        {STEPS.map((s) => (
          <li
            key={s.num}
            data-step={s.num}
            className="rounded-paper border border-[#d4b896] bg-cream p-5 shadow-paper relative"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-seal text-cream font-bold text-sm">
                {s.num}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted">
                {s.duration}
              </span>
            </div>
            <h3 className="text-base font-bold text-ink">{s.title}</h3>
            <p className="mt-2 text-xs text-ink/80 leading-relaxed">{s.desc}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-center text-xs text-muted">
        11 秒出一封草稿(纯本地预设)或更久(若启用 LLM)。
      </p>
    </section>
  );
}