import { describe, it, expect, vi, afterEach } from 'vitest';
import { OpenAiCompatibleClient } from '../src/llm/openaiCompatible.js';

describe('OpenAiCompatibleClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function mockFetch(body: unknown, status = 200) {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      text: async () => JSON.stringify(body),
      json: async () => body,
    } as unknown as Response);
  }

  it('POSTs to <base>/chat/completions with model + messages + Authorization when apiKey set', async () => {
    mockFetch({ choices: [{ message: { content: 'hi' } }] });
    const c = new OpenAiCompatibleClient('http://localhost:1234/v1', 'qwen2.5-coder-7b', 'lm-studio');
    await c.generate({ system: 'sys', user: 'usr' });
    const calls = (globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls;
    expect(calls[0][0]).toBe('http://localhost:1234/v1/chat/completions');
    const opts = calls[0][1] as { method: string; headers: Record<string, string>; body: string };
    expect(opts.method).toBe('POST');
    expect(opts.headers.Authorization).toBe('Bearer lm-studio');
    const body = JSON.parse(opts.body) as Record<string, unknown>;
    expect(body.model).toBe('qwen2.5-coder-7b');
    expect(body.messages).toEqual([
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'usr' },
    ]);
    expect((body as { temperature: number }).temperature).toBe(0.9);
  });

  it('omits Authorization header when no apiKey', async () => {
    mockFetch({ choices: [{ message: { content: 'hi' } }] });
    const c = new OpenAiCompatibleClient('http://localhost:8080/v1', 'llama-cpp');
    await c.generate({ system: 's', user: 'u' });
    const opts = (globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][1] as { headers: Record<string, string> };
    expect(opts.headers.Authorization).toBeUndefined();
  });

  it('returns text from choices[0].message.content', async () => {
    mockFetch({ choices: [{ message: { content: 'hello' } }] });
    const c = new OpenAiCompatibleClient('http://localhost:1234/v1', 'm');
    const r = await c.generate({ system: 's', user: 'u' });
    expect(r.text).toBe('hello');
    expect(r.neurons).toBe(0);
  });

  it('counts tokens from usage.prompt_tokens + usage.completion_tokens', async () => {
    mockFetch({
      choices: [{ message: { content: 'hi' } }],
      usage: { prompt_tokens: 50, completion_tokens: 80 },
    });
    const c = new OpenAiCompatibleClient('http://localhost:1234/v1', 'm');
    const r = await c.generate({ system: 's', user: 'u' });
    // local coefficient 0
    expect(r.neurons).toBe(0);
  });

  it('throws on non-2xx (e.g. 429)', async () => {
    mockFetch({ error: { message: 'rate limit' } }, 429);
    const c = new OpenAiCompatibleClient('http://localhost:1234/v1', 'm');
    await expect(c.generate({ system: 's', user: 'u' })).rejects.toThrow(/429/);
  });

  it('throws on empty content', async () => {
    mockFetch({ choices: [{ message: { content: '' } }] });
    const c = new OpenAiCompatibleClient('http://localhost:1234/v1', 'm');
    await expect(c.generate({ system: 's', user: 'u' })).rejects.toThrow(/empty/);
  });
});
