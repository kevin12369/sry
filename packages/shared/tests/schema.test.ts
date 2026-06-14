import { describe, it, expect } from 'vitest';
import { StyleMapSchema, StyleSchema, PersonalitySchema } from '../src/schema.js';

describe('StyleSchema', () => {
  it('accepts all 5 style ids', () => {
    for (const s of ['funny', 'sincere', 'shameless', 'legal-cold', 'silent-treatment'] as const) {
      expect(StyleSchema.parse(s)).toBe(s);
    }
  });

  it('rejects unknown style', () => {
    expect(() => StyleSchema.parse('rude')).toThrow();
  });
});

describe('PersonalitySchema', () => {
  it('accepts all 3 personalities', () => {
    for (const p of ['sensitive', 'direct', 'cold'] as const) {
      expect(PersonalitySchema.parse(p)).toBe(p);
    }
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
