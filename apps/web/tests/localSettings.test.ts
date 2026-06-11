// Verifies that generateLetters() injects the 4 local fields from
// sry:local:* when the active model is ollama / openai-compatible.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateLetters } from '@/lib/api';

describe('generateLetters local field injection', () => {
  const originalFetch = globalThis.fetch;
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    window.localStorage.clear();
    fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ letters: {}, meta: { model: 'ollama', latency_ms: 0 } }),
    } as unknown as Response);
    globalThis.fetch = fetchSpy as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('injects local fields into request body when model is ollama + sry:local:* set', async () => {
    localStorage.setItem('sry:useLocal', 'true');
    localStorage.setItem('sry:local:provider', 'ollama');
    localStorage.setItem('sry:local:baseUrl', 'http://localhost:11434');
    localStorage.setItem('sry:local:model', 'llama3.1:8b');
    localStorage.setItem('sry:local:apiKey', '');
    localStorage.setItem('sry:local:timeoutMs', '30000');

    await generateLetters(
      { situation: '我把猫放跑了', personality: 'sensitive' },
      { model: 'ollama' },
    );

    expect(fetchSpy).toHaveBeenCalledOnce();
    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.localBaseUrl).toBe('http://localhost:11434');
    expect(body.localModel).toBe('llama3.1:8b');
    expect(body.localTimeoutMs).toBe(30000);
    const headers = init.headers as Record<string, string>;
    expect(headers['x-model']).toBe('ollama');
  });
});
