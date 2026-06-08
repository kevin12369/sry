import { describe, it, expect } from 'vitest';
import { mapToPersonality, validateStep } from '@/lib/mapping';

describe('mapToPersonality', () => {
  it('朋友 + 真诚道歉 → sensitive', () => {
    expect(mapToPersonality('朋友', '真诚道歉', '真诚')).toBe('sensitive');
  });
  it('同事 + 解释清楚 → direct', () => {
    expect(mapToPersonality('同事', '解释清楚', '真诚')).toBe('direct');
  });
  it('家人 + 给个台阶 → cold', () => {
    expect(mapToPersonality('家人', '给个台阶', '真诚')).toBe('cold');
  });
  it('unknown combo falls back to sensitive', () => {
    expect(mapToPersonality('路人', '随便', '随便')).toBe('sensitive');
  });
});

describe('validateStep', () => {
  it('rejects empty situation', () => {
    expect(validateStep(1, '').ok).toBe(false);
  });
  it('rejects too-short situation (<5 chars)', () => {
    expect(validateStep(1, 'hi').ok).toBe(false);
  });
  it('rejects too-long situation (>300 chars)', () => {
    expect(validateStep(1, 'x'.repeat(301)).ok).toBe(false);
  });
  it('rejects all-whitespace situation', () => {
    expect(validateStep(1, '          ').ok).toBe(false);
  });
  it('accepts valid situation', () => {
    expect(validateStep(1, '我把室友的猫放跑了').ok).toBe(true);
  });
  it('rejects empty radio (steps 2-4)', () => {
    expect(validateStep(2, '').ok).toBe(false);
    expect(validateStep(3, '').ok).toBe(false);
    expect(validateStep(4, '').ok).toBe(false);
  });
});
