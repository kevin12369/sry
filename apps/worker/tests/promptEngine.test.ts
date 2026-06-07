import { describe, it, expect } from 'vitest';
import { getStylePrompt, renderUserPrompt, STYLES } from '../src/prompts/index.js';
import { describePersonality } from '../src/prompts/personalities.js';

describe('getStylePrompt', () => {
  it('returns a non-empty system prompt for every style', () => {
    for (const s of STYLES) {
      const p = getStylePrompt(s);
      expect(p.system.length).toBeGreaterThan(20);
    }
  });
  it('different styles have different system prompts', () => {
    const a = getStylePrompt('funny').system;
    const b = getStylePrompt('sincere').system;
    expect(a).not.toBe(b);
  });
});

describe('renderUserPrompt', () => {
  it('injects situation and personality_desc into the template', () => {
    const tpl = getStylePrompt('funny');
    const out = renderUserPrompt(tpl, {
      situation: '我把室友的猫放跑了',
      personality: 'direct',
    });
    expect(out).toContain('我把室友的猫放跑了');
    expect(out).toContain(describePersonality('direct'));
    expect(out).not.toContain('{situation}');
    expect(out).not.toContain('{personality_desc}');
  });
});
