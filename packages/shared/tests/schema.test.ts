import { describe, it, expect } from 'vitest';
import {
  GenerateRequestSchema,
  StyleMapSchema,
  SharePayloadSchema,
} from '../src/schema.js';

describe('GenerateRequestSchema', () => {
  it('accepts a valid request', () => {
    const ok = GenerateRequestSchema.parse({
      situation: '我弄坏了她的电脑',
      personality: 'direct',
    });
    expect(ok.personality).toBe('direct');
  });

  it('rejects situation under 5 chars', () => {
    expect(() =>
      GenerateRequestSchema.parse({ situation: 'hi', personality: 'sensitive' })
    ).toThrow();
  });

  it('rejects situation over 300 chars', () => {
    expect(() =>
      GenerateRequestSchema.parse({ situation: 'a'.repeat(301), personality: 'direct' })
    ).toThrow();
  });
});

describe('StyleMapSchema', () => {
  it('requires all 5 styles', () => {
    const ok = StyleMapSchema.parse({
      funny: 'a', sincere: 'b', shameless: 'c', 'legal-cold': 'd', 'silent-treatment': 'e',
    });
    expect(Object.keys(ok)).toHaveLength(5);
  });

  it('rejects missing style', () => {
    expect(() => StyleMapSchema.parse({ funny: 'a' })).toThrow();
  });
});

describe('SharePayloadSchema', () => {
  it('round-trips', () => {
    const p = SharePayloadSchema.parse({
      letters: { funny: 'a', sincere: 'b', shameless: 'c', 'legal-cold': 'd', 'silent-treatment': 'e' },
      situation: 'x',
      personality: 'cold',
    });
    expect(p.situation).toBe('x');
  });
});
