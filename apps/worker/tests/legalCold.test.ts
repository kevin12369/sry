import { describe, it, expect } from 'vitest';
import { LEGAL_COLD_PROMPT } from '../src/prompts/legalCold.js';

describe('LEGAL_COLD_PROMPT', () => {
  it('has 3 sections', () => {
    expect(LEGAL_COLD_PROMPT).toMatch(/Role:/);
    expect(LEGAL_COLD_PROMPT).toMatch(/Constraints:/);
    expect(LEGAL_COLD_PROMPT).toMatch(/Output:/);
  });
  it('requires contractual / passive voice', () => {
    expect(LEGAL_COLD_PROMPT).toMatch(/合同|声明|被动语态|formal/);
  });
  it('forbids emotional words', () => {
    expect(LEGAL_COLD_PROMPT).toMatch(/零情感|不出现|不得/);
  });
  it('specifies 100-160 字', () => {
    expect(LEGAL_COLD_PROMPT).toMatch(/100-160/);
  });
});
