'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getUsage, type Usage } from '@/lib/usage';

const POLL_INTERVAL_MS = 30_000;

export interface UseUsageState {
  usage: Usage | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useUsage(apiBase: string): UseUsageState {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelled = useRef(false);

  const fetchOnce = useCallback(async () => {
    try {
      const u = await getUsage(apiBase);
      if (!cancelled.current) {
        setUsage(u);
        setError(null);
      }
    } catch (e) {
      if (!cancelled.current) setError((e as Error).message);
    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    cancelled.current = false;
    setLoading(true);
    fetchOnce();
    const id = setInterval(fetchOnce, POLL_INTERVAL_MS);
    return () => {
      cancelled.current = true;
      clearInterval(id);
    };
  }, [fetchOnce]);

  return { usage, loading, error, refresh: fetchOnce };
}
