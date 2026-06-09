'use client';
import { useEffect, useState } from 'react';

export type MotionPreference = 'auto' | 'on' | 'off';

export function useReducedMotion(setting: MotionPreference): boolean {
  const [mediaReduced, setMediaReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMediaReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMediaReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (setting === 'on') return false;
  if (setting === 'off') return true;
  return mediaReduced; // 'auto'
}
