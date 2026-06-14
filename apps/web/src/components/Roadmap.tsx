interface Phase {
  id: string;
  label: string;
  status: string;
  badge: string;
  badgeColor: string;
  date: string;
  items: string[];
}

const PHASES: Phase[] = [
  {
    id: 'v1',
    label: 'v1',
    status: 'Done',
    badge: '✅',
    badgeColor: '6b8e5a',
    date: '2026-06',
    items: [
      '5 风格 + 预设范文 + URL 分享',
      '纯客户端,无 LLM 依赖',
      'Cloudflare Pages 部署',
    ],
  },
  {
    id: 'v2',
    label: 'v2',
    status: 'In progress',
    badge: '🚧',
    badgeColor: 'c75d4a',
    date: '2026 Q3',
    items: [
      '5 风格 × 6 场景 prompt table',
      'LLM 升级(浏览器 OAI 兼容 + BYOK)',
      'SPIN 转盘 + AI 损友点评',
      'Share-as-meme + 已读不回动画',
    ],
  },
  {
    id: 'v3',
    label: 'v3',
    status: 'Planned',
    badge: '🗓️',
    badgeColor: '8a7765',
    date: '2026 Q4',
    items: [
      '历史记录(本地存储)',
      '收藏最爱风格',
      '跨项目 portfolio hub',
    ],
  },
];

// PR #4: Roadmap 3 阶段时间线
export function Roadmap() {
  return (
    <section
      aria-labelledby="roadmap-title"
      data-section="roadmap"
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <h2
        id="roadmap-title"
        className="text-2xl md:text-3xl font-bold text-ink text-center mb-8"
      >
        路线图
      </h2>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 list-none">
        {PHASES.map((p) => (
          <li
            key={p.id}
            data-phase={p.id}
            className="rounded-paper border border-[#d4b896] bg-cream p-5 shadow-paper"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">{p.badge}</span>
                <span className="text-lg font-bold text-ink">{p.label}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted">
                {p.date}
              </span>
            </div>
            <span
              data-status={p.status}
              className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-cream"
              style={{ backgroundColor: `#${p.badgeColor}` }}
            >
              {p.status}
            </span>
            <ul className="mt-3 space-y-1 text-xs text-ink/80 list-disc list-inside">
              {p.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}