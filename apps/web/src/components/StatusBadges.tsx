interface Badge {
  label: string;
  value: string;
  color: string;
}

const BADGES: Badge[] = [
  { label: 'backend', value: '0', color: '6b8e5a' },
  { label: 'tests', value: 'passing', color: '6b8e5a' },
  { label: 'styles', value: '5', color: 'c75d4a' },
  { label: 'scenes', value: '6', color: 'c75d4a' },
  { label: 'share', value: 'URL%20hash', color: '5a3e2b' },
  { label: 'LLM', value: 'optional', color: '8a7765' },
];

// PR #4: 6 shields.io 徽章 - 用 img.shields.io 占位,保持 Sry 暖色调
// 实际是占位 badge,因为不是所有 metric 都是动态计算的
export function StatusBadges() {
  return (
    <section
      aria-label="项目状态徽章"
      data-section="status-badges"
      className="max-w-6xl mx-auto px-4 py-16 md:py-20"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        {BADGES.map((b) => (
          <img
            key={b.label}
            src={`https://img.shields.io/badge/${b.label}-${b.value}-${b.color}?style=flat-square&labelColor=fdf6ec`}
            alt={`${b.label}: ${b.value.replace(/%20/g, ' ')}`}
            loading="lazy"
            width={120}
            height={20}
          />
        ))}
      </div>
    </section>
  );
}