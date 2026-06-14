import { STYLES, STYLE_NAMES_ZH, STYLE_EMOJI, type StyleId } from '@/data/prompts';
import { ROASTS } from '@/data/roasts';

interface StyleMeta {
  en: string;
  desc: string;
}

const STYLE_EN_NAMES: Record<StyleId, string> = {
  funny: 'Funny',
  sincere: 'Sincere',
  deflect: 'Deflect',
  legal: 'Legal Cold Face',
  silent: 'Read & Forget',
};

const STYLE_DESCRIPTIONS: Record<StyleId, StyleMeta['desc']> = {
  funny: '笑着把事说圆,自嘲让对方不好意思继续生气。适合小事 / 朋友之间。',
  sincere: '真诚直接,把话说清楚不绕弯。适合亲密关系 / 想挽回的局。',
  deflect: '耍赖 + 找借口 + 嬉皮笑脸。适合你不想认错但又必须回。',
  legal: '公文冷面 + 不带感情。适合职场 / 商业 / 想划清界限。',
  silent: '什么都不写。适合你真不知道说什么,或者对方就是不值得。',
};

// PR #4: 5 风格对比段 - 让访客 30 秒理解每个风格干嘛
// 每张卡:大 emoji + 中文名 + 英文名 + 描述 + AI 损友点评(从 roasts.ts 取)
export function StyleCompare() {
  return (
    <section
      id="style-compare"
      aria-labelledby="style-compare-title"
      data-section="style-compare"
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <h2
        id="style-compare-title"
        className="text-2xl md:text-3xl font-bold text-ink text-center mb-8"
      >
        5 种人格面具,挑一个今晚当
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {STYLES.map((s) => (
          <article
            key={s}
            data-style={s}
            className="rounded-paper border border-[#d4b896] bg-cream p-5 shadow-paper flex flex-col"
          >
            <div className="text-4xl mb-2" aria-hidden="true">
              {STYLE_EMOJI[s]}
            </div>
            <h3 className="text-base font-bold text-ink">
              {STYLE_NAMES_ZH[s]}
            </h3>
            <p className="text-[11px] uppercase tracking-wider text-seal font-semibold">
              {STYLE_EN_NAMES[s]}
            </p>
            <p className="mt-3 text-xs text-ink/80 leading-relaxed flex-1">
              {STYLE_DESCRIPTIONS[s]}
            </p>
            <div className="mt-4 pt-3 border-t border-[#d4b896]">
              <p className="text-[10px] uppercase tracking-wider text-muted mb-1">
                AI 损友点评
              </p>
              <p className="text-xs text-ink italic">
                &ldquo;{ROASTS[s].apology}&rdquo;
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}