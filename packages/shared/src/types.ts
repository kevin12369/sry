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

export type RejectReason =
  | 'too-long'
  | 'too-short'
  | 'real-person'
  | 'harassment'
  | 'rate-limit'
  | 'quota-exceeded'
  | 'kill-switch';

export type ModelId = 'workers-ai' | 'gemini-flash' | 'claude-haiku';

export interface GenerateRequest {
  situation: string;
  personality: Personality;
}

export interface GenerateResponse {
  letters: StyleMap;
  meta: {
    model: ModelId;
    latency_ms: number;
    cached?: boolean;
  };
}

export interface GenerateError {
  error: RejectReason;
  message: string;
}

export interface SharePayload {
  letters: StyleMap;
  situation: string;
  personality: Personality;
}
