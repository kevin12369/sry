import { describe, it, expect } from 'vitest';
import { FUNNY_PROMPT } from '../src/prompts/funny.js';

describe('FUNNY_PROMPT', () => {
  it('has Role, Constraints, Output sections', () => {
    expect(FUNNY_PROMPT).toMatch(/Role:/);
    expect(FUNNY_PROMPT).toMatch(/Constraints:/);
    expect(FUNNY_PROMPT).toMatch(/Output:/);
  });
  it('mentions {situation} and {personality_desc}', () => {
    expect(FUNNY_PROMPT).toContain('{situation}');
    expect(FUNNY_PROMPT).toContain('{personality_desc}');
  });
  it('forbids real apology (style is funny)', () => {
    expect(FUNNY_PROMPT).toMatch(/不能真道歉|不要真的道歉|not a real apology/i);
  });
  it('specifies 150-200 字', () => {
    expect(FUNNY_PROMPT).toMatch(/150-200|150–200/);
  });
});
