import type { GenerateRequest, GenerateResponse, ModelId } from '@sry/shared';

export interface ApiOpts {
  baseUrl?: string;
  model?: ModelId;
  apiKey?: string;
}

export async function generateLetters(req: GenerateRequest, opts: ApiOpts = {}): Promise<GenerateResponse> {
  const base = opts.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE ?? (typeof window !== 'undefined' ? (window as unknown as { __SRY_API__?: string }).__SRY_API__ : undefined) ?? '';
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (opts.model) headers['x-model'] = opts.model;
  if (opts.apiKey) headers['x-api-key'] = opts.apiKey;
  const res = await fetch(`${base}/api/gen`, { method: 'POST', headers, body: JSON.stringify(req) });
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
