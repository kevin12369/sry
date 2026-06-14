interface Column {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

const COLUMNS: Column[] = [
  {
    title: 'Brand',
    links: [
      { label: 'Sry.lol / 嘴替游乐场', href: '/' },
      { label: '🎭 Persona Mask Generator · MIT', href: '#' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: 'https://github.com/kevin12369/sry', external: true },
      { label: 'Issues', href: 'https://github.com/kevin12369/sry/issues', external: true },
      { label: 'Discussions', href: 'https://github.com/kevin12369/sry/discussions', external: true },
      { label: 'Changelog', href: 'https://github.com/kevin12369/sry/releases', external: true },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { label: 'RUN-LOCALLY.md', href: 'https://github.com/kevin12369/sry/blob/main/docs/RUN-LOCALLY.md', external: true },
      { label: 'SPEC', href: 'https://github.com/kevin12369/sry/blob/main/docs/superpowers/specs/2026-06-14-sry-v2-design.md', external: true },
      { label: '路线图', href: '#roadmap-title' },
      { label: 'FAQ', href: '#faq-title' },
    ],
  },
  {
    title: 'Author',
    links: [
      { label: '491750329@qq.com', href: 'mailto:491750329@qq.com' },
      { label: 'GitHub @kevin12369', href: 'https://github.com/kevin12369', external: true },
      { label: 'Star on GitHub', href: 'https://github.com/kevin12369/sry', external: true },
    ],
  },
];

// PR #4: Footer 4 列 + 版权 + 隐私链接
export function Footer() {
  return (
    <footer
      data-section="footer"
      className="bg-zinc-900 text-zinc-300"
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">
                {col.title}
              </h3>
              <ul className="space-y-1.5 text-sm">
                {col.links.map((link, idx) => (
                  <li key={`${col.title}-${idx}`}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="hover:text-zinc-100 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col md:flex-row md:justify-between gap-3 text-xs text-zinc-500">
          <p>
            © 2026 Sry.lol · MIT · 491750329@qq.com · 隐私:零数据收集
          </p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-zinc-300 transition-colors">
              隐私
            </a>
            <a
              href="https://github.com/kevin12369/sry/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}