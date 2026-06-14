// PR #1 P0: Hero 段 - 立题 + 痛点 + 2 CTA(已删 5 风格对比预览 emoji 横排)
// Sry 主题是暖色纸面(cream/paper/ink/seal),用一致的色板
// PR #1 之后:Hero 段只剩小标 + h1 + 副标 + 痛点 + 2 CTA
// 5 风格信息由下方"5 种人格面具"段(StyleCompare)独占
export function Hero() {
  return (
    <section
      aria-labelledby="sry-hero-title"
      data-section="hero"
      className="max-w-6xl mx-auto px-4 py-12 md:py-16"
    >
      <div className="max-w-3xl space-y-5">
        <p className="text-xs uppercase tracking-widest text-seal font-semibold">
          AI Persona Mask Generator
        </p>
        <h1
          id="sry-hero-title"
          className="text-4xl md:text-5xl font-bold text-ink leading-tight"
        >
          Sry.lol / 嘴替游乐场
        </h1>
        <p className="text-lg text-ink/85 leading-relaxed">
          输入你闯的祸,挑你今晚的人设。
          5 种人格面具对比出 5 封,挑一封会心一笑的草稿。
          <span className="text-seal">发不发随你</span>
          (我们不管,也不想知道)。
        </p>
        <p className="text-sm text-ink/70 italic border-l-4 border-seal pl-3">
          不会骂人?不会道歉?不会拒绝?不会表白?
          —— 挑一封不用自己写的。
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="#demo"
            data-cta="try-demo"
            className="inline-flex items-center gap-2 bg-seal text-cream px-5 py-2.5 rounded-md font-medium hover:bg-[#a84938] transition-colors"
          >
            Try live demo →
          </a>
          <a
            href="#style-compare"
            data-cta="view-styles"
            className="inline-flex items-center gap-2 border border-ink/40 text-ink px-5 py-2.5 rounded-md font-medium hover:bg-paper transition-colors"
          >
            View 5 styles →
          </a>
        </div>
      </div>
    </section>
  );
}