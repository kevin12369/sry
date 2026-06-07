import { describe, it, expect } from 'vitest';
import { checkAndIncrement } from '../src/ethics/rateLimit.js';

class FakeKV {
  store = new Map<string, { value: string; exp?: number }>();
  async get(k: string): Promise<string | null> {
    const v = this.store.get(k);
    if (!v) return null;
    if (v.exp && v.exp < Date.now()) { this.store.delete(k); return null; }
    return v.value;
  }
  async put(k: string, v: string, opts?: { expirationTtl?: number }) {
    this.store.set(k, { value: v, exp: opts?.expirationTtl ? Date.now() + opts.expirationTtl * 1000 : undefined });
  }
}

describe('checkAndIncrement', () => {
  it('allows first 10 requests in a window', async () => {
    const kv = new FakeKV();
    for (let i = 0; i < 10; i++) {
      const r = await checkAndIncrement('1.2.3.4', kv as unknown as KVNamespace, 10, 60);
      expect(r.ok).toBe(true);
    }
  });

  it('blocks the 11th request in the same window', async () => {
    const kv = new FakeKV();
    for (let i = 0; i < 10; i++) {
      await checkAndIncrement('1.2.3.4', kv as unknown as KVNamespace, 10, 60);
    }
    const r = await checkAndIncrement('1.2.3.4', kv as unknown as KVNamespace, 10, 60);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('rate-limit');
  });

  it('separates IPs', async () => {
    const kv = new FakeKV();
    for (let i = 0; i < 10; i++) {
      await checkAndIncrement('1.1.1.1', kv as unknown as KVNamespace, 10, 60);
    }
    const r = await checkAndIncrement('2.2.2.2', kv as unknown as KVNamespace, 10, 60);
    expect(r.ok).toBe(true);
  });
});
