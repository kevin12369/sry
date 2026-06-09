import { describe, it, expect } from 'vitest';
import { wouldExceedProjectCap } from '@/router/quota';

describe('wouldExceedProjectCap', () => {
  it('returns true if estimated + used >= daily cap', () => {
    expect(wouldExceedProjectCap(8000, 7900, 200)).toBe(true);
  });

  it('returns false if estimated + used < daily cap', () => {
    expect(wouldExceedProjectCap(8000, 100, 200)).toBe(false);
  });

  it('returns true at exact boundary (used + estimated == cap)', () => {
    expect(wouldExceedProjectCap(8000, 7800, 200)).toBe(true);
  });

  it('treats 0 cap as "unlimited" (never exceeds)', () => {
    expect(wouldExceedProjectCap(0, 99999, 99999)).toBe(false);
  });
});
