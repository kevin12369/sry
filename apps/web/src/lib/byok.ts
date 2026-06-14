// 简化 BYOK: 用户自配 LLM 端点 + key
// localStorage 存储 (关 tab 不丢, 只存端点不是真 key 也无所谓)
import { loadJSON, saveJSON } from './storage';

export interface ByokConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  enabled: boolean;       // false = 走预设范文, 不调 LLM
}

const STORAGE_KEY = 'sry:byok';

export const DEFAULT_BYOK: ByokConfig = {
  baseUrl: 'http://localhost:11434/v1',
  apiKey: 'ollama',
  model: 'llama3.1:8b',
  enabled: false,
};

export function loadByok(): ByokConfig | null {
  const raw = loadJSON<unknown>(STORAGE_KEY, null as unknown);
  if (raw == null) return null;
  return migrateByok(raw);
}

export function saveByok(config: ByokConfig): void {
  saveJSON(STORAGE_KEY, config);
}

export function clearByok(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function migrateByok(raw: unknown): ByokConfig {
  const r = (raw ?? {}) as Partial<ByokConfig> & Record<string, unknown>;
  return {
    baseUrl: typeof r.baseUrl === 'string' && r.baseUrl.length > 0 ? r.baseUrl : DEFAULT_BYOK.baseUrl,
    apiKey: typeof r.apiKey === 'string' ? r.apiKey : DEFAULT_BYOK.apiKey,
    model: typeof r.model === 'string' && r.model.length > 0 ? r.model : DEFAULT_BYOK.model,
    enabled: r.enabled === true,
  };
}