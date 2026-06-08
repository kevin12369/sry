import { Card, CardBody } from './ui/card.js';
import { Button } from './ui/button.js';
import type { RejectReason } from '@sry/shared';

const MESSAGES: Record<RejectReason, { title: string; body: string }> = {
  'too-long': { title: '输入太长', body: '请把情境控制在 300 字以内。' },
  'too-short': { title: '输入太短', body: '至少写 5 个字,这样 LLM 才知道你做了什么。' },
  'real-person': { title: '请求被拒绝', body: '抱歉,该请求不符合服务条款。请改写后再试。' },
  'harassment': { title: '请求被拒绝', body: '抱歉,该请求不符合服务条款。请改写后再试。' },
  'rate-limit': { title: '请求太快', body: '请等 1 分钟后再试。' },
  'quota-exceeded': { title: '今日免费额度已用完', body: '明天 00:00 UTC 重置,或自带 Key 继续。' },
  'kill-switch': { title: '服务暂不可用', body: '请稍后重试。' },
};

export function RejectScreen({ reason, onReset }: { reason: RejectReason; onReset: () => void }) {
  const m = MESSAGES[reason];
  return (
    <Card>
      <CardBody className="text-center py-10 space-y-4">
        <h2 className="text-lg font-semibold">{m.title}</h2>
        <p className="text-sm text-slate-600">{m.body}</p>
        <Button variant="outline" onClick={onReset}>返回</Button>
      </CardBody>
    </Card>
  );
}
