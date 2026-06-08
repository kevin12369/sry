import { describe, it, expect } from 'vitest';
import { estimateNeuronsFromUsage } from '@/llm/neurons';

describe('estimateNeuronsFromUsage', () => {
  it('Llama 3.1 8B: 1 neuron per token (coefficient 1)', () => {
    const usage = { prompt_tokens: 100, completion_tokens: 50 };
    expect(estimateNeuronsFromUsage('workers-ai', usage)).toBe(150);
  });

  it('returns 0 when usage is missing', () => {
    expect(estimateNeuronsFromUsage('workers-ai', undefined)).toBe(0);
  });

  it('returns 0 when usage fields are missing', () => {
    expect(estimateNeuronsFromUsage('workers-ai', {})).toBe(0);
  });

  it('handles non-Workers-AI models with 1x coefficient (defensive)', () => {
    expect(estimateNeuronsFromUsage('gemini-flash', { prompt_tokens: 200, completion_tokens: 100 })).toBe(300);
    expect(estimateNeuronsFromUsage('claude-haiku', { prompt_tokens: 200, completion_tokens: 100 })).toBe(300);
  });
});
