import { describe, it, expect } from 'vitest';
import { STYLES, SCENES, PROMPTS, STYLE_NAMES_ZH, SCENE_NAMES_ZH, type StyleId, type SceneId } from '@/data/prompts';
import { ROASTS } from '@/data/roasts';
import { SAMPLE_LETTERS } from '@/data/sample-letters';

describe('prompts table', () => {
  it('has 5 styles x 6 scenes = 30 prompt entries', () => {
    expect(STYLES).toHaveLength(5);
    expect(SCENES).toHaveLength(6);
    let n = 0;
    for (const s of STYLES) {
      for (const c of SCENES) {
        expect(PROMPTS[s][c]).toBeTruthy();
        n++;
      }
    }
    expect(n).toBe(30);
  });

  it('has a Chinese name for each style and scene', () => {
    for (const s of STYLES) expect(STYLE_NAMES_ZH[s]).toBeTruthy();
    for (const c of SCENES) expect(SCENE_NAMES_ZH[c]).toBeTruthy();
  });
});

describe('roasts table', () => {
  it('has 5 styles x 6 scenes = 30 roast entries, all ≤ 16 chars', () => {
    let n = 0;
    for (const s of STYLES) {
      for (const c of SCENES) {
        const r = ROASTS[s as StyleId][c as SceneId];
        expect(r).toBeTruthy();
        expect([...r].length).toBeLessThanOrEqual(16);
        n++;
      }
    }
    expect(n).toBe(30);
  });
});

describe('sample letters', () => {
  it('has 5 preset letters; silent is empty (已读不回 = 真的没回)', () => {
    expect(Object.keys(SAMPLE_LETTERS)).toHaveLength(5);
    expect(SAMPLE_LETTERS.silent).toBe('');
    for (const s of ['funny', 'sincere', 'deflect', 'legal'] as const) {
      expect(SAMPLE_LETTERS[s].length).toBeGreaterThanOrEqual(50);
    }
  });
});
