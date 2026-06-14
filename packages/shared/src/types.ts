export const PERSONALITIES = ['sensitive', 'direct', 'cold'] as const;
export type Personality = (typeof PERSONALITIES)[number];

export const STYLES = [
  'funny',
  'sincere',
  'shameless',
  'legal-cold',
  'silent-treatment',
] as const;
export type Style = (typeof STYLES)[number];

export type StyleMap = Record<Style, string>;
