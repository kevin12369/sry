import { describe, it, expect } from 'vitest';
import { FALLBACK_LETTERS } from '../src/killSwitch/templates.js';
import { STYLES } from '@sry/shared';

describe('FALLBACK_LETTERS', () => {
  it('has one letter for every style', () => {
    for (const s of STYLES) {
      expect(FALLBACK_LETTERS[s]).toBeTruthy();
      expect(FALLBACK_LETTERS[s].length).toBeGreaterThan(0);
    }
  });
  it('mentions [场景] placeholder', () => {
    expect(FALLBACK_LETTERS['funny']).toContain('[场景]');
  });
});
