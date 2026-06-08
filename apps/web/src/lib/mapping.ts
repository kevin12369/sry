import type { Personality } from '@sry/shared';

export type Audience = '朋友' | '同事' | '家人';
export type Goal = '真诚道歉' | '给个台阶' | '解释清楚';
export type Tone = '搞笑' | '真诚' | '耍赖' | '法务' | '已读不回';

export type StepInput = {
  audience?: Audience;
  goal?: Goal;
  tone?: Tone;
  situation?: string;
};

const AUDIENCE_BY_GOAL: Record<Goal, Record<Audience, Personality>> = {
  真诚道歉: { 朋友: 'sensitive', 同事: 'direct', 家人: 'cold' },
  给个台阶: { 朋友: 'sensitive', 同事: 'direct', 家人: 'cold' },
  解释清楚: { 朋友: 'sensitive', 同事: 'direct', 家人: 'cold' },
};

export function mapToPersonality(a: string | undefined, g: string | undefined, _t: string | undefined): Personality {
  if (!a || !g) return 'sensitive';
  const m = (AUDIENCE_BY_GOAL as Record<string, Record<string, Personality>>)[g]?.[a];
  return m ?? 'sensitive';
}

export function validateStep(step: 1 | 2 | 3 | 4, value: string): { ok: boolean; reason?: string } {
  if (step === 1) {
    const trimmed = value.trim();
    if (trimmed.length < 5) return { ok: false, reason: 'too-short' };
    if (trimmed.length > 300) return { ok: false, reason: 'too-long' };
    return { ok: true };
  }
  if (value.trim() === '') return { ok: false, reason: 'empty' };
  return { ok: true };
}
