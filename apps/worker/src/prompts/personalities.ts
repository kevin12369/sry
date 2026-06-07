import { PERSONALITIES, type Personality } from '@sry/shared';

export { PERSONALITIES };

export const PERSONALITY_DESC: Record<Personality, string> = {
  sensitive: '对方是敏感型人格:易察觉语气与情绪,会反复咀嚼细节,需要被共情和确认感受。',
  direct: '对方是直率型人格:反感绕弯子,只看结论与行动项,喜欢简洁的道歉。',
  cold: '对方是冷淡型人格:不轻易表态,只想要一个事实性、零情绪负担的回应,简短即可。',
};

export function describePersonality(p: Personality): string {
  return PERSONALITY_DESC[p];
}
