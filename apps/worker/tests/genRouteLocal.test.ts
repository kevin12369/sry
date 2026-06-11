// Integration tests for the local LLM routing path in /api/gen.
// Verifies: (1) ollama happy path reaches OllamaClient, (2) missing
// baseUrl returns 400, (3) file:// URL rejected by SSRF guard (400).

import { describe, it, expect, vi, afterEach } from 'vitest';
import worker from '../src/index.js';

class FakeKV {
  store = new Map<string, string>();
  async get(k: string) { return this.store.get(k) ?? null; }
  async put(k: string, v: string, _opts?: unknown) { this.store.set(k, v); }
  async delete(k: string) { this.store.delete(k); }
}

function makeEnv(): Env {
  return {
    AI: {} as Ai,
    RL: new FakeKV() as unknown as KVNamespace,
    LLM_KILL_SWITCH: 'false',
    DEFAULT_MODEL: 'workers-ai',
    PROJECT_DAILY_NEURONS_CAP: '8000',
    PROJECT_MONTHLY_NEURONS_CAP: '240000',
  };
}

function validBody(extra: Record<string, unknown> = {}) {
  return {
    situation: '我把室友的猫放跑了,他很生气',
    personality: 'sensitive',
    ...extra,
  };
}

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('POST /api/gen local routing', () => {
  it('routes ollama model to OllamaClient when localBaseUrl set', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ response: 'oops\n\ntake 2' }),
      json: async () => ({ response: 'oops\n\ntake 2' }),
    } as unknown as Response);
    globalThis.fetch = fetchSpy;

    const env = makeEnv();
    const req = new Request('http://x/api/gen', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-model': 'ollama',
        'cf-connecting-ip': '1.2.3.4',
      },
      body: JSON.stringify(validBody({
        model: 'ollama',
        localBaseUrl: 'http://localhost:11434',
        localModel: 'llama3.1:8b',
      })),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalled();
    const calledUrl = (fetchSpy.mock.calls[0] as unknown[])[0] as string;
    expect(calledUrl).toBe('http://localhost:11434/api/generate');
  });

  it('rejects ollama without localBaseUrl with 400', async () => {
    const env = makeEnv();
    const req = new Request('http://x/api/gen', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-model': 'ollama',
        'cf-connecting-ip': '1.2.3.4',
      },
      body: JSON.stringify(validBody({ model: 'ollama' })),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(400);
    const json = await res.json() as { error?: string; message?: string };
    expect(json.error).toBe('kill-switch');
    expect(json.message).toMatch(/baseUrl/);
  });

  it('rejects localBaseUrl with file:// protocol (SSRF guard)', async () => {
    const env = makeEnv();
    const req = new Request('http://x/api/gen', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-model': 'ollama',
        'cf-connecting-ip': '1.2.3.4',
      },
      body: JSON.stringify(validBody({
        model: 'ollama',
        localBaseUrl: 'file:///etc/passwd',
        localModel: 'x',
      })),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(400);
  });
});
