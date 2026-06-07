import { describe, it, expect } from 'vitest';
import { PERSONALITIES, PERSONALITY_DESC, describePersonality } from '../src/prompts/personalities.js';

describe('PERSONALITY_DESC', () => {
  it('covers every Personality', () => {
    for (const p of PERSONALITIES) {
      expect(PERSONALITY_DESC[p]).toBeTruthy();
    }
  });
  it('sensitive emphasizes empathy', () => {
    expect(PERSONALITY_DESC.sensitive).toMatch(/共情|感受|情绪/);
  });
  it('direct emphasizes brevity', () => {
    expect(PERSONALITY_DESC.direct).toMatch(/直接|简洁|要点/);
  });
  it('cold emphasizes distance', () => {
    expect(PERSONALITY_DESC.cold).toMatch(/冷淡|距离|简短/);
  });
});

describe('describePersonality', () => {
  it('returns the description', () => {
    expect(describePersonality('direct')).toBe(PERSONALITY_DESC.direct);
  });
});
