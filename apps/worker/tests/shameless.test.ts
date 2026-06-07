import { describe, it, expect } from 'vitest';
import { SHAMELESS_PROMPT } from '../src/prompts/shameless.js';

describe('SHAMELESS_PROMPT', () => {
  it('has 3 sections', () => {
    expect(SHAMELESS_PROMPT).toMatch(/Role:/);
    expect(SHAMELESS_PROMPT).toMatch(/Constraints:/);
    expect(SHAMELESS_PROMPT).toMatch(/Output:/);
  });
  it('forbids admitting fault', () => {
    expect(SHAMELESS_PROMPT).toMatch(/不承认错误|不认错/);
  });
  it('mentions 邀功/反咬', () => {
    expect(SHAMELESS_PROMPT).toMatch(/邀功|反咬|卖乖/);
  });
  it('specifies 120-180 字', () => {
    expect(SHAMELESS_PROMPT).toMatch(/120-180/);
  });
});
