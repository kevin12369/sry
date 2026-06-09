import { loadJSON } from '@/lib/storage';
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
  if (opts.model) headers['x-model'] = opts.model;
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
