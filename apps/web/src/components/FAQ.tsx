interface QA {
  q: string;
  a: string;
}

const QA_LIST: QA[] = [
  {
    q: '这个跟 ChatGPT 有什么不同?',
    a: 'ChatGPT 给你一封,Sry.lol 给你 5 种人格面具对比 + 1 行损友点评。差异是"看 5 种选择哪个适合我"的过程,不是"AI 写得多好"。',
  },
  {
    q: 'AI 损友点评会伤人吗?',
    a: '16 字以内,调侃但不刻薄;如果对方是真人,我们建议你先看完再决定要不要发。',
  },
  {
    q: '我输入的会泄露吗?',
    a: '不会。所有处理在你浏览器内,无后端持久化(本项目 v2 已删 worker);URL hash 分享只编码你选了哪封,不入服务端。',
  },
  {
    q: '必须配 LLM 吗?',
    a: '不必须。默认走 5 封预设范文(我们手调),你点 SPIN / 选风格就能玩。想真玩调你自己的 LLM(粘贴端点 + key)。',
  },
  {
    q: '真的不发吗?',
    a: '真的不发。我们是嘴替游乐场,不是道歉信发送器。你挑完一封,自己复制粘贴到你想要的地方。',
  },
];

// PR #4: FAQ 5 折叠 - <details>/<summary> 原生 HTML,无 JS 依赖
export function FAQ() {
  return (
    <section
      aria-labelledby="faq-title"
      data-section="faq"
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <h2
        id="faq-title"
        className="text-2xl md:text-3xl font-bold text-ink text-center mb-8"
      >
        常见疑问
      </h2>
      <div className="space-y-2">
        {QA_LIST.map((item, idx) => (
          <details
            key={item.q}
            data-faq={idx + 1}
            className="rounded-paper border border-[#d4b896] bg-cream p-4 group"
          >
            <summary className="cursor-pointer font-semibold text-ink list-none flex justify-between items-center">
              <span>Q{idx + 1}. {item.q}</span>
              <span
                aria-hidden="true"
                className="text-seal transition-transform group-open:rotate-45 text-lg"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-ink/80 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}