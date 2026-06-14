import { z } from 'zod';
import { PERSONALITIES, STYLES } from './types.js';

export const PersonalitySchema = z.enum(PERSONALITIES);
export const StyleSchema = z.enum(STYLES);

export const StyleMapSchema = z.object(
  STYLES.reduce((acc, s) => ({ ...acc, [s]: z.string() }), {} as Record<(typeof STYLES)[number], z.ZodString>)
);
