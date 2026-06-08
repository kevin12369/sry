import { describe, it, expect } from 'vitest';
import worker from '../src/index.js';
import { CORS_HEADERS, preflight, withCors } from '../src/util/cors.js';

// In-memory KVNamespace stub. Only the methods the worker actually uses
// (get / put with optional expirationTtl) are implemented.
function makeKV(): KVNamespace {
  const store = new Map<string, string>();
  return {
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
    async delete(key: string) {
      store.delete(key);
    },
    async list() {
      return {
        keys: Array.from(store.keys()).map((name) => ({ name })),
        list_complete: true,
        cacheStatus: null,
      };
    },
    async getWithMetadata() {
      return { value: null, metadata: null, cacheStatus: null };
    },
  } as unknown as KVNamespace;
}

// A minimal Env that lets /api/gen get past rate-limit and quota but
// returns 5xx-free content via the kill-switch path (so we don't depend on
// Workers AI binding in unit tests).
function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    AI: {} as Ai,
    RL: makeKV(),
    LLM_KILL_SWITCH: 'true', // short-circuit to FALLBACK_LETTERS
    DEFAULT_MODEL: 'workers-ai',
    ...overrides,
  } as Env;
}

const DEV_ORIGIN = 'http://localhost:3000';
const PROD_ORIGIN = 'https://sry-web.pages.dev';

describe('CORS preflight (OPTIONS /api/gen)', () => {
  it('preflight() returns 204 with the expected CORS headers', () => {
    const res = preflight();
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe(CORS_HEADERS['access-control-allow-origin']);
    expect(res.headers.get('access-control-allow-methods')).toBe(CORS_HEADERS['access-control-allow-methods']);
    expect(res.headers.get('access-control-allow-headers')).toBe(CORS_HEADERS['access-control-allow-headers']);
  });

  it('withCors() attaches the CORS headers to a regular response', () => {
    const original = new Response('ok', { status: 200 });
    const wrapped = withCors(original);
    expect(wrapped.headers.get('access-control-allow-origin')).toBe(CORS_HEADERS['access-control-allow-origin']);
    expect(wrapped.status).toBe(200);
  });

  it('responds 204 to OPTIONS /api/gen from the dev origin', async () => {
    const req = new Request('http://127.0.0.1:8787/api/gen', {
      method: 'OPTIONS',
      headers: {
        Origin: DEV_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type, x-model',
      },
    });
    const res = await worker.fetch(req, makeEnv());
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBeTruthy();
    expect(res.headers.get('access-control-allow-methods')).toMatch(/POST/);
    expect(res.headers.get('access-control-allow-headers')).toMatch(/content-type/);
  });

  it('responds 204 to OPTIONS /api/gen from the prod origin', async () => {
    const req = new Request('http://127.0.0.1:8787/api/gen', {
      method: 'OPTIONS',
      headers: {
        Origin: PROD_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type, x-model',
      },
    });
    const res = await worker.fetch(req, makeEnv());
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBeTruthy();
  });

  it('a real POST from the dev origin includes CORS headers on the response', async () => {
    const req = new Request('http://127.0.0.1:8787/api/gen', {
      method: 'POST',
      headers: {
        Origin: DEV_ORIGIN,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ situation: '把文本写长一点假装通过校验再触发服务端', personality: 'direct' }),
    });
    const res = await worker.fetch(req, makeEnv());
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBeTruthy();
    const body = (await res.json()) as { letters: Record<string, string> };
    expect(Object.keys(body.letters).sort()).toEqual(
      ['funny', 'legal-cold', 'shameless', 'silent-treatment', 'sincere'],
    );
  });
});
