import { describe, it, expect } from 'vitest';
import { STYLES, SCENES, PROMPTS, STYLE_NAMES_ZH, SCENE_NAMES_ZH, type StyleId, type SceneId } from '@/data/prompts';
import { ROASTS } from '@/data/roasts';
import { SAMPLE_LETTERS } from '@/data/sample-letters';
import { STYLE_SYSTEM, SCENE_CONTEXT, COMMON_PREFIX, OUTPUT_FORMAT } from '@/data/system-prompts';

describe('prompts table (5×6 = 30)', () => {
  it('has 5 styles x 6 scenes = 30 prompt entries', () => {
    expect(STYLES).toHaveLength(5);
    expect(SCENES).toHaveLength(6);
    let n = 0;
    for (const s of STYLES) {
      for (const c of SCENES) {
        expect(PROMPTS[s][c]).toBeTruthy();
        expect(PROMPTS[s][c].length).toBeGreaterThan(4);
        n++;
      }
    }
    expect(n).toBe(30);
  });

  it('has a Chinese name for each style and scene', () => {
    for (const s of STYLES) expect(STYLE_NAMES_ZH[s]).toBeTruthy();
    for (const c of SCENES) expect(SCENE_NAMES_ZH[c]).toBeTruthy();
  });

  it('PROMPTS is exhaustive: every (style,scene) cell is a non-empty string', () => {
    for (const s of STYLES) {
      for (const c of SCENES) {
        expect(typeof PROMPTS[s as StyleId][c as SceneId]).toBe('string');
      }
    }
  });
});

describe('roasts table (5×6 = 30, ≤16 chars)', () => {
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

  it('each roast has no trailing whitespace', () => {
    for (const s of STYLES) {
      for (const c of SCENES) {
        expect(ROASTS[s as StyleId][c as SceneId]).toBe(
          ROASTS[s as StyleId][c as SceneId].trim(),
        );
      }
    }
  });
});

describe('sample letters (5 presets)', () => {
  it('has 5 preset letters; silent is empty (已读不回 = 真的没回)', () => {
    expect(Object.keys(SAMPLE_LETTERS)).toHaveLength(5);
    expect(SAMPLE_LETTERS.silent).toBe('');
    for (const s of ['funny', 'sincere', 'deflect', 'legal'] as const) {
      expect(SAMPLE_LETTERS[s].length).toBeGreaterThanOrEqual(50);
    }
  });
});

describe('system prompts (PR #2)', () => {
  it('STYLE_SYSTEM has 5 entries, silent tells LLM to reply empty string', () => {
    const keys = Object.keys(STYLE_SYSTEM);
    expect(keys).toHaveLength(5);
    expect(STYLE_SYSTEM.silent).toContain('空字符串');
  });

  it('non-silent STYLE_SYSTEM entries remind LLM not to send on user behalf', () => {
    for (const s of STYLES) {
      if (s === 'silent') continue; // silent's job is to return empty string
      expect(STYLE_SYSTEM[s]).toContain('不替');
      expect(STYLE_SYSTEM[s]).toContain('起稿');
    }
  });

  it('SCENE_CONTEXT has 6 entries, each non-empty', () => {
    expect(Object.keys(SCENE_CONTEXT)).toHaveLength(6);
    for (const c of SCENES) expect(SCENE_CONTEXT[c]).toBeTruthy();
  });

  it('COMMON_PREFIX and OUTPUT_FORMAT exist', () => {
    expect(COMMON_PREFIX).toBeTruthy();
    expect(OUTPUT_FORMAT).toBeTruthy();
  });
});