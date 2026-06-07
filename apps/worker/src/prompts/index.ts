import type { Personality, Style, GenerateRequest } from '@sry/shared';
import { FUNNY_PROMPT } from './funny.js';
import { SINCERE_PROMPT } from './sincere.js';
import { SHAMELESS_PROMPT } from './shameless.js';
import { LEGAL_COLD_PROMPT } from './legalCold.js';
import { SILENT_TREATMENT_PROMPT } from './silentTreatment.js';
import { describePersonality } from './personalities.js';

export interface StylePrompt {
  system: string;
  userTemplate: string; // contains {situation} and {personality_desc}
}

const PROMPTS: Record<Style, StylePrompt> = {
  'funny': { system: FUNNY_PROMPT, userTemplate: '情境:{situation}\n对方性格:{personality_desc}\n请写这封搞笑道歉信。' },
  'sincere': { system: SINCERE_PROMPT, userTemplate: '情境:{situation}\n对方性格:{personality_desc}\n请写这封真诚道歉信。' },
  'shameless': { system: SHAMELESS_PROMPT, userTemplate: '情境:{situation}\n对方性格:{personality_desc}\n请写这封厚脸皮道歉信。' },
  'legal-cold': { system: LEGAL_COLD_PROMPT, userTemplate: '情境:{situation}\n对方性格:{personality_desc}\n请写这封法律冷面道歉信。' },
  'silent-treatment': { system: SILENT_TREATMENT_PROMPT, userTemplate: '情境:{situation}\n对方性格:{personality_desc}\n请写这封已读不回极简回应。' },
};

export const STYLES = ['funny', 'sincere', 'shameless', 'legal-cold', 'silent-treatment'] as const;

export function getStylePrompt(style: Style): StylePrompt {
  return PROMPTS[style];
}

export function renderUserPrompt(template: StylePrompt, req: Pick<GenerateRequest, 'situation' | 'personality'>): string {
  return template.userTemplate
    .replace('{situation}', req.situation)
    .replace('{personality_desc}', describePersonality(req.personality as Personality));
}
