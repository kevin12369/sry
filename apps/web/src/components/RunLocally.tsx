// PR #4: Run Locally 3 步 - zinc-900 反转 bg
// 3 行命令 + 需求 list + 1 段说明
const COMMANDS = [
  'git clone https://github.com/kevin12369/sry.git',
  'cd sry && pnpm install',
  'pnpm dev:web',
];

const REQUIREMENTS = [
  { label: 'Node.js 20+', required: true },
  { label: 'pnpm 9+', required: true },
  { label: 'Ollama 本地(可选 — 想真玩 LLM)', required: false },
  { label: 'OpenAI key(可选 — 想真玩 LLM)', required: false },
];

export function RunLocally() {
  return (
    <section
      aria-labelledby="run-locally-title"
      data-section="run-locally"
      className="bg-zinc-900 text-zinc-100"
    >
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <h2
          id="run-locally-title"
          className="text-2xl md:text-3xl font-bold text-center mb-3"
        >
          本地跑起来
        </h2>
        <p className="text-center text-sm text-zinc-400 mb-8">
          3 行命令,1 分钟搞定。
        </p>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            {COMMANDS.map((cmd, idx) => (
              <pre
                key={cmd}
                data-cmd={idx + 1}
                className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 overflow-x-auto"
              >
                <span className="text-zinc-500 select-none mr-2">$</span>
                {cmd}
              </pre>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3 text-zinc-200">需求</h3>
            <ul className="space-y-1.5 text-sm">
              {REQUIREMENTS.map((r) => (
                <li key={r.label} className="flex items-center gap-2">
                  <span aria-hidden="true" className={r.required ? 'text-green-400' : 'text-zinc-500'}>
                    {r.required ? '✓' : '·'}
                  </span>
                  <span className={r.required ? '' : 'text-zinc-400'}>
                    {r.label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-4">
              <strong className="text-zinc-200">0 后端,0 配额,0 隐私顾虑。</strong>
              所有处理都在你的浏览器里,无后端持久化,无 KV,无 IP rate-limit。
              想真玩 LLM 就自己粘贴 OpenAI / Ollama key,BYOK 默认禁用。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}