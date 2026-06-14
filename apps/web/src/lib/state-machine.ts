import type { SceneId, StyleId } from '@/data/prompts';

export interface LetterEntry {
  style: StyleId;
  body: string;
  roast: string;
}

export type SryState =
  | { stage: 'idle' }
  | { stage: 'composing'; scene: SceneId; spinning: boolean }
  | { stage: 'ready'; scene: SceneId; letters: LetterEntry[] }
  | { stage: 'error'; error: string };

export const initialState: SryState = { stage: 'idle' };

export function toComposing(scene: SceneId, spinning: boolean): SryState {
  return { stage: 'composing', scene, spinning };
}

export function toReady(scene: SceneId, letters: LetterEntry[]): SryState {
  return { stage: 'ready', scene, letters };
}

export function toError(error: string): SryState {
  return { stage: 'error', error };
}
