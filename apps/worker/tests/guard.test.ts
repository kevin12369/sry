import { describe, it, expect } from 'vitest';
import { ethicsCheck } from '../src/ethics/guard.js';

describe('ethicsCheck', () => {
  it('passes a normal situation', () => {
    expect(ethicsCheck({ situation: '我把室友的猫放跑了,他很生气', personality: 'direct' }))
      .toEqual({ ok: true });
  });

  it('rejects too-short situation', () => {
    const r = ethicsCheck({ situation: 'hi', personality: 'direct' });
    expect(r).toEqual({ ok: false, reason: 'too-short' });
  });

  it('rejects too-long situation', () => {
    const r = ethicsCheck({ situation: 'a'.repeat(301), personality: 'direct' });
    expect(r).toEqual({ ok: false, reason: 'too-long' });
  });

  it('rejects real-person attack', () => {
    const r = ethicsCheck({ situation: '我要弄死王伟这个王八蛋', personality: 'cold' });
    expect(r).toEqual({ ok: false, reason: 'real-person' });
  });

  it('rejects harassment with repetition', () => {
    const r = ethicsCheck({ situation: '我要死缠烂打放手手手手', personality: 'sensitive' });
    expect(r).toEqual({ ok: false, reason: 'harassment' });
  });

  it('rejects empty situation', () => {
    const r = ethicsCheck({ situation: '', personality: 'direct' });
    expect(r).toEqual({ ok: false, reason: 'too-short' });
  });
});
