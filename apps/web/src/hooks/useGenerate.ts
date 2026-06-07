'use client';
import { useState } from 'react';
import { ApiError, generateLetters, type ApiOpts } from '@/lib/api';
import type { GenerateRequest, GenerateResponse } from '@sry/shared';

export interface UseGenerate {
  loading: boolean;
  error: { code: string; message: string } | null;
  data: GenerateResponse | null;
  run: (req: GenerateRequest, opts?: ApiOpts) => Promise<void>;
}

export function useGenerate(): UseGenerate {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<UseGenerate['error']>(null);
  const [data, setData] = useState<GenerateResponse | null>(null);

  async function run(req: GenerateRequest, opts?: ApiOpts) {
    setLoading(true); setError(null); setData(null);
    try {
      const out = await generateLetters(req, opts);
      setData(out);
    } catch (e) {
      if (e instanceof ApiError) {
        setError({ code: e.code, message: e.message });
      } else {
        setError({ code: 'network', message: (e as Error).message });
      }
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, run };
}
