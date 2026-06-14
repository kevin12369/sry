import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  encodeShare,
  decodeShare,
  buildShareUrl,
  parseShareUrl,
  encodeMemeShare,
  decodeMemeShare,
  buildMemeShareUrl,
  parseMemeUrl,
} from '@/lib/share';

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

describe('meme share (PR #3: buildMemeShareUrl + parseMemeUrl)', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('encodeMemeShare + decodeMemeShare round-trip with kind:"meme"', () => {
    const hash = encodeMemeShare(payload);
    expect(hash).not.toMatch(/[+/=]/);
    const decoded = decodeMemeShare(hash);
    expect(decoded).not.toBeNull();
    expect(decoded?.kind).toBe('meme');
    expect(decoded?.scene).toBe(payload.scene);
    expect(decoded?.letter).toBe(payload.letter);
  });

  it('buildMemeShareUrl embeds #meme= hash', () => {
    const url = buildMemeShareUrl(payload);
    expect(url).toMatch(/#meme=/);
  });

  it('parseMemeUrl reads the new #meme= format', () => {
    const url = buildMemeShareUrl(payload);
    window.location.hash = url.split('#')[1] ?? '';
    const parsed = parseMemeUrl();
    expect(parsed).not.toBeNull();
    expect(parsed?.kind).toBe('meme');
    expect(parsed?.scene).toBe(payload.scene);
  });

  it('parseMemeUrl also accepts the legacy #share= format and tags it meme', () => {
    const url = buildShareUrl(payload);
    window.location.hash = url.split('#')[1] ?? '';
    const parsed = parseMemeUrl();
    expect(parsed).not.toBeNull();
    expect(parsed?.kind).toBe('meme');
    expect(parsed?.scene).toBe(payload.scene);
  });

  it('parseMemeUrl returns null when no share/meme hash is present', () => {
    window.location.hash = '';
    expect(parseMemeUrl()).toBeNull();
  });
});
