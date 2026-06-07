import { describe, it, expect, vi } from 'vitest';
import { WorkersAIClient } from '../src/llm/workersAi.js';

describe('WorkersAIClient', () => {
  it('calls binding.run with correct model and returns response_text', async () => {
    const run = vi.fn().mockResolvedValue({ response: '你好,道歉。' });
    const ai = { run } as unknown as Ai;
    const c = new WorkersAIClient(ai);
    const out = await c.generate({
      system: '你是搞笑作家',
      user: '我把室友的猫放跑了',
      maxTokens: 400,
      temperature: 0.9,
    });
    expect(out).toBe('你好,道歉。');
    expect(run).toHaveBeenCalledWith(
      '@cf/meta/llama-3.1-8b-instruct',
      expect.objectContaining({ max_tokens: 400, temperature: 0.9 })
    );
  });
});
