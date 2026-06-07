import { describe, it, expect } from 'vitest';
import { SILENT_TREATMENT_PROMPT } from '../src/prompts/silentTreatment.js';

describe('SILENT_TREATMENT_PROMPT', () => {
  it('has 3 sections', () => {
    expect(SILENT_TREATMENT_PROMPT).toMatch(/Role:/);
    expect(SILENT_TREATMENT_PROMPT).toMatch(/Constraints:/);
    expect(SILENT_TREATMENT_PROMPT).toMatch(/Output:/);
  });
  it('requires 1-2 sentences only', () => {
    expect(SILENT_TREATMENT_PROMPT).toMatch(/1-2 句|1-2句|极简/);
  });
  it('forbids elaboration', () => {
    expect(SILENT_TREATMENT_PROMPT).toMatch(/不要解释|不解释|不要展开/);
  });
  it('requires 嗯/行/好 marker words', () => {
    expect(SILENT_TREATMENT_PROMPT).toMatch(/嗯|行|好/);
  });
});
