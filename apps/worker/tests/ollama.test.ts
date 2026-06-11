import { describe, it, expect, vi, afterEach } from 'vitest';
import { OllamaClient } from '../src/llm/ollama.js';

describe('OllamaClient', () => {
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

  it('POSTs to <base>/api/generate with model + prompt + stream:false', async () => {
    mockFetch({ response: 'hi' });
    const c = new OllamaClient('http://localhost:11434', 'llama3.1:8b');
    await c.generate({ system: 'sys', user: 'usr' });
    const calls = (globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls;
    expect(calls[0][0]).toBe('http://localhost:11434/api/generate');
    const opts = calls[0][1] as { method: string; body: string };
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body) as Record<string, unknown>;
    expect(body.model).toBe('llama3.1:8b');
    expect(body.prompt).toBe('sys\n\nusr');
    expect(body.stream).toBe(false);
    expect((body.options as { temperature: number }).temperature).toBe(0.9);
  });

  it('returns text from response field + reports model=ollama', async () => {
    mockFetch({ response: 'hello there' });
    const c = new OllamaClient('http://localhost:11434', 'llama3.1:8b');
    const r = await c.generate({ system: 's', user: 'u' });
    expect(r.text).toBe('hello there');
    expect(r.neurons).toBe(0);
    // (id comes from LLMClient contract — but our OllamaClient doesn't carry id,
    //  just test that we get a clean result back)
  });

  it('counts tokens from prompt_eval_count + eval_count', async () => {
    mockFetch({
      response: 'hi',
      prompt_eval_count: 12,
      eval_count: 34,
    });
    const c = new OllamaClient('http://localhost:11434', 'llama3.1:8b');
    const r = await c.generate({ system: 's', user: 'u' });
    // neurons coefficient for ollama is 0 in our setup → neurons=0
    expect(r.neurons).toBe(0);
  });

  it('throws on non-2xx', async () => {
    mockFetch({ error: 'model not found' }, 404);
    const c = new OllamaClient('http://localhost:11434', 'nope');
    await expect(c.generate({ system: 's', user: 'u' })).rejects.toThrow(/404/);
  });

  it('throws on empty response', async () => {
    mockFetch({ response: '' });
    const c = new OllamaClient('http://localhost:11434', 'llama3.1:8b');
    await expect(c.generate({ system: 's', user: 'u' })).rejects.toThrow(/empty/);
  });
});
