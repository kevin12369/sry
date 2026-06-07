import { describe, it, expect } from 'vitest';
import { SINCERE_PROMPT } from '../src/prompts/sincere.js';

describe('SINCERE_PROMPT', () => {
  it('has all 3 sections', () => {
    expect(SINCERE_PROMPT).toMatch(/Role:/);
    expect(SINCERE_PROMPT).toMatch(/Constraints:/);
    expect(SINCERE_PROMPT).toMatch(/Output:/);
  });
  it('mentions empathy and concrete action', () => {
    expect(SINCERE_PROMPT).toMatch(/共情|感受/);
    expect(SINCERE_PROMPT).toMatch(/具体|行动|改正/);
  });
  it('specifies 180-260 字', () => {
    expect(SINCERE_PROMPT).toMatch(/180-260/);
  });
  it('injects both variables', () => {
    expect(SINCERE_PROMPT).toContain('{situation}');
    expect(SINCERE_PROMPT).toContain('{personality_desc}');
  });
});
