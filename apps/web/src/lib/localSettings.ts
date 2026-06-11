// Local LLM settings — separate localStorage namespace `sry:local:*` to
// keep the main `sry:settings:v2` schema simple. Read by the api-client
// and the home page toggle.

export interface LocalSettings {
  provider: 'ollama' | 'openai-compatible' | '';
  baseUrl: string;
  model: string;
  apiKey: string;
  timeoutMs: number;
  useLocal: boolean;
}

export const DEFAULT_LOCAL: LocalSettings = {
  provider: 'ollama',
  baseUrl: 'http://localhost:11434',
  model: '',
  apiKey: '',
  timeoutMs: 30000,
  useLocal: false,
};

const KEYS = {
  provider: 'sry:local:provider',
  baseUrl: 'sry:local:baseUrl',
  model: 'sry:local:model',
  apiKey: 'sry:local:apiKey',
  timeoutMs: 'sry:local:timeoutMs',
  useLocal: 'sry:useLocal',
} as const;

function readStr(key: string, fallback: string): string {
  if (typeof localStorage === 'undefined') return fallback;
  return localStorage.getItem(key) ?? fallback;
}

export function loadLocalSettings(): LocalSettings {
  const provider = readStr(KEYS.provider, DEFAULT_LOCAL.provider) as LocalSettings['provider'];
  return {
    provider,
    baseUrl: readStr(KEYS.baseUrl, DEFAULT_LOCAL.baseUrl),
    model: readStr(KEYS.model, DEFAULT_LOCAL.model),
    apiKey: readStr(KEYS.apiKey, DEFAULT_LOCAL.apiKey),
    timeoutMs: Number(readStr(KEYS.timeoutMs, String(DEFAULT_LOCAL.timeoutMs))),
    useLocal: readStr(KEYS.useLocal, 'false') === 'true',
  };
}

export function isLocalProviderActive(): boolean {
  if (typeof localStorage === 'undefined') return false;
  if (readStr(KEYS.useLocal, 'false') !== 'true') return false;
  const p = readStr(KEYS.provider, '');
  return p === 'ollama' || p === 'openai-compatible';
}
