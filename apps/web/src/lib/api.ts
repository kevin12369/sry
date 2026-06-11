import { loadJSON } from '@/lib/storage';
import { isLocalProviderActive, loadLocalSettings } from '@/lib/localSettings';
import type { Settings } from '@/hooks/useSettings';
import type { GenerateRequest, GenerateResponse, ModelId } from '@sry/shared';

const DEFAULT_API_BASE = 'https://sry-worker.491750329.workers.dev';

function getApiBaseFromStorage(): string {
  if (typeof window === 'undefined') return DEFAULT_API_BASE;
  const s = loadJSON<Partial<Settings>>('sry:settings:v2', {});
  return s.apiBase || DEFAULT_API_BASE;
}

declare global {
  interface Window {
    __SRY_API__?: string;
  }
}

export interface ApiOpts {
  baseUrl?: string;
  model?: ModelId;
  apiKey?: string;
}

export async function generateLetters(req: GenerateRequest, opts: ApiOpts = {}): Promise<GenerateResponse> {
  const base = opts.baseUrl
    ?? getApiBaseFromStorage()
    ?? (typeof window !== 'undefined' ? window.__SRY_API__ : undefined)
    ?? DEFAULT_API_BASE;
  const headers: Record<string, string> = { 'content-type': 'application/json' };

  // If the request didn't pin a model, fall back to the sry:settings:v2
  // choice. If the user enabled a local provider, pin to that.
  let model: ModelId | undefined = opts.model;
  if (!model) {
    const stored = loadJSON<Partial<Settings>>('sry:settings:v2', {});
    model = stored.model as ModelId | undefined;
  }
  if (!model && isLocalProviderActive()) {
    const ls = loadLocalSettings();
    model = ls.provider as ModelId;
  }

  if (model === 'ollama' || model === 'openai-compatible') {
    headers['x-model'] = model;
    // Inject the 4 local fields from storage when the caller didn't
    // provide them — keeps the home page form simple.
    const ls = loadLocalSettings();
    const body: GenerateRequest & Record<string, unknown> = { ...req };
    if (body.localBaseUrl === undefined) body.localBaseUrl = ls.baseUrl;
    if (body.localModel === undefined) body.localModel = ls.model;
    if (body.localApiKey === undefined && ls.apiKey) body.localApiKey = ls.apiKey;
    if (body.localTimeoutMs === undefined) body.localTimeoutMs = ls.timeoutMs;

    if (opts.apiKey) headers['x-api-key'] = opts.apiKey;
    const res = await fetch(`${base.replace(/\/$/, '')}/api/gen`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new ApiError(res.status, j.error ?? 'unknown', j.message ?? `HTTP ${res.status}`);
    }
    return (await res.json()) as GenerateResponse;
  }

  if (model) headers['x-model'] = model;
  if (opts.apiKey) headers['x-api-key'] = opts.apiKey;
  const res = await fetch(`${base.replace(/\/$/, '')}/api/gen`, {
    method: 'POST',
    headers,
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? 'unknown', body.message ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as GenerateResponse;
}

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}
