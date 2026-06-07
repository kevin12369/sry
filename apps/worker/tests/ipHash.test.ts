import { describe, it, expect } from 'vitest';
import { hashIp } from '../src/util/ipHash.js';

describe('hashIp', () => {
  it('returns 64-char hex', async () => {
    const h = await hashIp('1.2.3.4');
    expect(h).toMatch(/^[a-f0-9]{64}$/);
  });

  it('is deterministic for same input', async () => {
    expect(await hashIp('1.2.3.4')).toBe(await hashIp('1.2.3.4'));
  });

  it('differs for different input', async () => {
    expect(await hashIp('1.2.3.4')).not.toBe(await hashIp('5.6.7.8'));
  });
});
