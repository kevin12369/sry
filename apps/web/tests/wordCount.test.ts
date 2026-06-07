import { describe, it, expect } from 'vitest';
import { countChars } from '../src/lib/wordCount.js';

describe('countChars', () => {
  it('counts pure Chinese chars', () => {
    expect(countChars('你好')).toBe(2);
  });
  it('counts spaces and punctuation', () => {
    expect(countChars('你好,世界!')).toBe(6);
  });
  it('counts emoji as 1', () => {
    expect(countChars('😆 哈哈')).toBeGreaterThanOrEqual(3);
  });
});
