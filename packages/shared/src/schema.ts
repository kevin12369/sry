import { z } from 'zod';
import { PERSONALITIES, STYLES } from './types.js';

export const PersonalitySchema = z.enum(PERSONALITIES);
export const StyleSchema = z.enum(STYLES);

export const GenerateRequestSchema = z.object({
  situation: z
    .string()
    .min(5, 'too-short')
    .max(300, 'too-long'),
  personality: PersonalitySchema,
});

export const StyleMapSchema = z.object(
  STYLES.reduce((acc, s) => ({ ...acc, [s]: z.string() }), {} as Record<(typeof STYLES)[number], z.ZodString>)
);

export const SharePayloadSchema = z.object({
  letters: StyleMapSchema,
  situation: z.string(),
  personality: PersonalitySchema,
});

export const RejectReasonSchema = z.enum([
  'too-long', 'too-short', 'real-person', 'harassment', 'rate-limit', 'quota-exceeded', 'kill-switch',
]);

export const ModelIdSchema = z.enum([
  'workers-ai',
  'gemini-flash',
  'claude-haiku',
  'deepseek',
  'ollama',
  'openai-compatible',
]);

export const LocalFieldsSchema = z.object({
  localBaseUrl: z.string().optional(),
  localModel: z.string().optional(),
  localApiKey: z.string().optional(),
  localTimeoutMs: z.number().int().positive().max(120000).optional(),
});
