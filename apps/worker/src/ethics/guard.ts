import { GenerateRequestSchema, type RejectReason } from '@sry/shared';
import { containsHarassment, containsRealPersonAttack } from './keywords.js';

export type EthicsResult =
  | { ok: true }
  | { ok: false; reason: RejectReason };

const REJECT_MESSAGES: Record<RejectReason, string> = {
  'too-long': '输入超出 300 字上限',
  'too-short': '输入太短,请至少 5 个字',
  'real-person': '检测到可能针对真人的恶意内容,已拒绝',
  'harassment': '内容触发骚扰模式,已拒绝',
  'rate-limit': '请求太快,请稍后再试',
  'quota-exceeded': '今日免费额度已用完',
  'kill-switch': '服务暂不可用',
};

export function ethicsCheck(raw: unknown): EthicsResult {
  const parsed = GenerateRequestSchema.safeParse(raw);
  if (!parsed.success) {
    const code = parsed.error.errors[0]?.message;
    if (code === 'too-long') return reject('too-long');
    return reject('too-short');
  }
  const { situation } = parsed.data;
  if (containsRealPersonAttack(situation)) return reject('real-person');
  if (containsHarassment(situation)) return reject('harassment');
  return { ok: true };
}

function reject(reason: RejectReason): EthicsResult {
  return { ok: false, reason };
}
