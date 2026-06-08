import { Paper } from './Paper';

const MESSAGES: Record<string, { title: string; body: string }> = {
  'too-long':       { title: '输入太长',  body: '请把情境控制在 300 字以内。' },
  'too-short':      { title: '输入太短',  body: '至少写 5 个字,这样 LLM 才知道你做了什么。' },
  'real-person':    { title: '请求被拒绝', body: '抱歉,该请求不符合服务条款。请改写后再试。' },
  'harassment':     { title: '请求被拒绝', body: '抱歉,该请求不符合服务条款。请改写后再试。' },
  'rate-limit':     { title: '请求太快',  body: '请等 1 分钟后再试。' },
  'quota-exceeded': { title: '今日免费额度已用完', body: '明天 00:00 UTC 重置,或自带 Key 继续。' },
  'kill-switch':    { title: '服务暂不可用', body: '请稍后重试。' },
};

export function RejectScreen({ reason, onReset }: { reason: keyof typeof MESSAGES; onReset: () => void }) {
  const m = MESSAGES[reason] ?? MESSAGES['kill-switch'];
  return (
    <Paper padding="lg" className="max-w-md mx-auto text-center space-y-3">
      <div className="inline-block border-2 border-dashed border-seal text-seal text-xs px-2 py-1 rotate-[-3deg]">
        请 阅
      </div>
      <h2 className="text-lg font-semibold text-seal">{m.title}</h2>
      <p className="text-sm text-ink leading-relaxed">{m.body}</p>
      <button
        onClick={onReset}
        className="mt-3 bg-ink text-cream px-5 py-2 rounded hover:bg-dark transition-colors"
      >
        返回
      </button>
    </Paper>
  );
}
