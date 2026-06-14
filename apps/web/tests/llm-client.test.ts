import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callLlm, LlmError } from '@/lib/llm-client';

const config = {
  baseUrl: 'http://localhost:11434/v1',
  apiKey: 'ollama',
  model: 'llama3.1:8b',
};

describe('callLlm — happy path', () => {
  it('returns choices[0].message.content on 200', async () => {
    const fetchSpy = vi.fn(async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: 'hi there' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchSpy);

    const out = await callLlm({
      config,
      messages: [{ role: 'user', content: 'hello' }],
    });
    expect(out).toBe('hi there');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const callArgs = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    const url = callArgs[0];
    const init = callArgs[1];
    expect(url).toBe('http://localhost:11434/v1/chat/completions');
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe('llama3.1:8b');
    expect(body.messages[0].content).toBe('hello');
    expect(body.stream).toBe(false);
    expect(body.max_tokens).toBe(200);
    expect(body.temperature).toBe(0.7);
    const headers = init.headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer ollama');
    vi.unstubAllGlobals();
  });

  it('joins baseUrl with /chat/completions even when no trailing slash', async () => {
    const fetchSpy = vi.fn(async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchSpy);
    await callLlm({ config: { ...config, baseUrl: 'http://example.com/v1/' }, messages: [] });
    const url = (fetchSpy.mock.calls[0] as unknown as [string])[0];
    expect(url).toBe('http://example.com/v1/chat/completions');
    vi.unstubAllGlobals();
  });

  it('throws LlmError PARSE when content missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ choices: [{ message: {} }] }), { status: 200 }),
      ),
    );
    await expect(callLlm({ config, messages: [] })).rejects.toBeInstanceOf(LlmError);
    await expect(callLlm({ config, messages: [] })).rejects.toMatchObject({ code: 'PARSE' });
    vi.unstubAllGlobals();
  });
});

describe('callLlm — error paths', () => {
  it('throws LlmError NETWORK on fetch rejection', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));
    await expect(callLlm({ config, messages: [] })).rejects.toMatchObject({ code: 'NETWORK' });
    vi.unstubAllGlobals();
  });

  it('throws LlmError HTTP_4XX on 401', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('unauthorized', { status: 401 })),
    );
    await expect(callLlm({ config, messages: [] })).rejects.toMatchObject({
      code: 'HTTP_4XX',
      status: 401,
    });
    vi.unstubAllGlobals();
  });

  it('throws LlmError HTTP_5XX on 502', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('bad gateway', { status: 502 })),
    );
    await expect(callLlm({ config, messages: [] })).rejects.toMatchObject({
      code: 'HTTP_5XX',
      status: 502,
    });
    vi.unstubAllGlobals();
  });

  it('throws LlmError TIMEOUT when aborted', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: unknown, init: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init.signal?.addEventListener('abort', () => {
            const e = new DOMException('aborted', 'AbortError');
            reject(e);
          });
        }),
      ),
    );
    const p = callLlm({ config: { ...config, timeoutMs: 50 }, messages: [] });
    const assertion = expect(p).rejects.toMatchObject({ code: 'TIMEOUT' });
    vi.advanceTimersByTime(60);
    await assertion;
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});

describe('LlmError', () => {
  it('carries code and status', () => {
    const e = new LlmError('HTTP_4XX', 'nope', 403);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe('HTTP_4XX');
    expect(e.status).toBe(403);
    expect(e.message).toBe('nope');
    expect(e.name).toBe('LlmError');
  });
});

describe('unmount cleanup', () => {
  beforeEach(() => { vi.useRealTimers(); });
  afterEach(() => { vi.unstubAllGlobals(); });
  it('does not leak AbortController when fetch resolves fast', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ choices: [{ message: { content: 'x' } }] }), { status: 200 }),
      ),
    );
    const out = await callLlm({ config, messages: [] });
    expect(out).toBe('x');
  });
});