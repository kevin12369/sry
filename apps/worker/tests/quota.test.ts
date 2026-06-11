import { describe, it, expect } from 'vitest';
import { preCheck, recordUsage, defaultCaps, type Usage } from '../src/router/quota.js';

class FakeKV {
  store = new Map<string, string>();
  async get(k: string) { return this.store.get(k) ?? null; }
  async put(k: string, v: string) { this.store.set(k, v); }
}

const kv = new FakeKV();

describe('preCheck', () => {
  it('allows first request for fresh IP', async () => {
    const r = await preCheck('iphash1', 'self', kv as unknown as KVNamespace);
    expect(r.ok).toBe(true);
  });

  it('blocks self-mode when both free tiers exhausted', async () => {
    const k = 'iphash2';
    // simulate already maxed out
    await kv.put(`usage:${k}:${today()}`, JSON.stringify({
      workers_ai: 10000, gemini: 1500, deepseek: 0, byok: 0, local: 0, requests: 100,
    } satisfies Usage));
    const r = await preCheck(k, 'self', kv as unknown as KVNamespace);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('quota-exceeded');
  });

  it('blocks byok-mode when daily_cap set and reached', async () => {
    const k = 'iphash3';
    await kv.put(`cap:${k}`, JSON.stringify({ mode: 'byok', daily_cap: 5, monthly_cap: 100, byok_enabled: true }));
    await kv.put(`usage:${k}:${today()}`, JSON.stringify({
      workers_ai: 0, gemini: 0, deepseek: 0, byok: 5, local: 0, requests: 5,
    } satisfies Usage));
    const r = await preCheck(k, 'byok', kv as unknown as KVNamespace);
    expect(r.ok).toBe(false);
  });
});

describe('recordUsage', () => {
  it('increments counters and persists', async () => {
    const k = 'iphash4';
    await recordUsage(k, 'gemini', kv as unknown as KVNamespace);
    const stored = await kv.get(`usage:${k}:${today()}`);
    expect(stored).toBeTruthy();
    const u = JSON.parse(stored!);
    expect(u.gemini).toBe(1);
    expect(u.requests).toBe(1);
  });
});

function today() { return new Date().toISOString().slice(0, 10); }

// suppress unused warning
void defaultCaps;
