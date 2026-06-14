import { describe, it, expect } from 'vitest';
import { encodeShare, decodeShare, buildShareUrl, parseShareUrl } from '@/lib/share';

const payload = {
  scene: 'apology' as const,
  style: 'funny' as const,
  letter: '前天我把你珍藏的绝版唱片摔了',
  roast: '这封最像朋友圈段子手',
  situation: '把唱片摔了',
};

describe('encodeShare / decodeShare (PR #1 granularity)', () => {
  it('round-trips single letter + roast payload', () => {
    const hash = encodeShare(payload);
    expect(decodeShare(hash)).toEqual(payload);
  });

  it('produces a URL-safe hash (no +, /, =)', () => {
    const hash = encodeShare(payload);
    expect(hash).not.toMatch(/[+/=]/);
  });

  it('returns null on garbage input', () => {
    expect(decodeShare('not-base64-!!!')).toBeNull();
  });

  it('returns null when required fields missing', () => {
    expect(decodeShare(encodeShare({ ...payload, letter: '' as string }))).not.toBeNull();
    expect(decodeShare(encodeShare({ ...payload, scene: undefined as unknown as 'apology' }))).toBeNull();
  });

  it('buildShareUrl contains the hash', () => {
    const url = buildShareUrl(payload);
    expect(url).toMatch(/#share=/);
  });

  it('parseShareUrl returns null when no hash', () => {
    expect(parseShareUrl()).toBeNull();
  });
});
