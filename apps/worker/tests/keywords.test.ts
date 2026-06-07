import { describe, it, expect } from 'vitest';
import {
  SURNAMES,
  MALICIOUS_WORDS,
  HARASSMENT_WORDS,
  containsRealPersonAttack,
  containsHarassment,
} from '../src/ethics/keywords.js';

describe('SURNAMES', () => {
  it('has at least 50 entries', () => {
    expect(SURNAMES.length).toBeGreaterThanOrEqual(50);
  });
  it('includes common surnames', () => {
    expect(SURNAMES).toContain('王');
    expect(SURNAMES).toContain('李');
    expect(SURNAMES).toContain('张');
  });
});

describe('containsRealPersonAttack', () => {
  it('flags surname + malicious word', () => {
    expect(containsRealPersonAttack('我要报复王伟')).toBe(true);
  });
  it('does not flag surname alone', () => {
    expect(containsRealPersonAttack('我老婆叫王芳')).toBe(false);
  });
  it('does not flag malicious word alone', () => {
    expect(containsRealPersonAttack('这事儿真麻烦')).toBe(false);
  });
  it('handles different surnames', () => {
    expect(containsRealPersonAttack('弄死张磊这个骗子')).toBe(true);
  });
});

describe('containsHarassment', () => {
  it('flags 死缠烂打 + repetition', () => {
    expect(containsHarassment('我要死缠烂打不放你走手手手')).toBe(true);
  });
  it('flags 拉黑 + repetition', () => {
    expect(containsHarassment('把你拉黑了啊啊啊')).toBe(true);
  });
  it('does not flag a normal mention', () => {
    expect(containsHarassment('我今天心情不太好')).toBe(false);
  });
});
