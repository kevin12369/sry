// Per-model neuron coefficients. Workers AI publishes per-model neuron-per-1k-token
// rates, but for our 4 models the rate is 1 neuron per token (rounded).
// See: https://developers.cloudflare.com/workers-ai/platform/pricing/
// (For more accurate billing, fetch the per-model rate from a Cloudflare API; out of scope for MVP.)

import type { ModelId } from '@sry/shared';

export interface UsageLike {
  prompt_tokens?: number;
  completion_tokens?: number;
}

const COEFFICIENT: Record<ModelId, number> = {
  'workers-ai': 1,
  'gemini-flash': 1,
  'claude-haiku': 1,
  'deepseek': 1,
  'ollama': 0,
  'openai-compatible': 0,
};

export function estimateNeuronsFromUsage(model: ModelId, usage: UsageLike | undefined): number {
  if (!usage) return 0;
  const p = usage.prompt_tokens ?? 0;
  const c = usage.completion_tokens ?? 0;
  const coef = COEFFICIENT[model] ?? 1;
  return Math.ceil((p + c) * coef);
}
