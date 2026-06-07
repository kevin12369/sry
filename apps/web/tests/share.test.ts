import { describe, it, expect } from 'vitest';
import { encodeShare, decodeShare } from '../src/lib/share.js';

const payload = {
  letters: {
    'funny': 'a', 'sincere': 'b', 'shameless': 'c', 'legal-cold': 'd', 'silent-treatment': 'e',
  },
  situation: '我把室友的猫放跑了',
  personality: 'direct' as const,
};

describe('encodeShare / decodeShare', () => {
  it('round-trips data', () => {
    const hash = encodeShare(payload);
    const decoded = decodeShare(hash);
    expect(decoded).toEqual(payload);
  });

  it('produces a URL-safe hash (no +, /, =)', () => {
    const hash = encodeShare(payload);
    expect(hash).not.toMatch(/[+/=]/);
  });

  it('returns null on garbage input', () => {
    expect(decodeShare('not-base64-!!!')).toBeNull();
  });
});
