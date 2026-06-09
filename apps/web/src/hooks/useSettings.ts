'use client';
import { useEffect, useState } from 'react';
import { loadJSON, saveJSON } from '@/lib/storage';
import type { ModelId } from '@sry/shared';

export type Tone = '搞笑' | '真诚' | '耍赖' | '法务' | '已读不回';

export interface Settings {
  // === BYOK ===
  model: ModelId;
  apiKey: string;

  // === Preferences ===
  apiBase: string;
  defaultTone: Tone;
  motion: 'auto' | 'on' | 'off';
  darkMode: 'light' | 'dark' | 'auto';

  // === User BYOK hard caps (UI only; backend can't enforce across providers) ===
  userDailyCapUsd: number;
  userMonthlyCapUsd: number;
}

const KEY = 'sry:settings:v2';
const DEFAULT_API_BASE = 'https://sry-worker.491750329.workers.dev';

export const DEFAULTS: Settings = {
  model: 'workers-ai',
  apiKey: '',
  apiBase: DEFAULT_API_BASE,
  defaultTone: '真诚',
  motion: 'auto',
  darkMode: 'light',
  userDailyCapUsd: 0,
  userMonthlyCapUsd: 0,
};

// Legacy v1 (and any partial v2 in localStorage) -> v2.
// Handles: removed dailyCap/monthlyCap, renamed to userXxxCapUsd, added 4 new fields.
export function migrateSettings(raw: unknown): Settings {
  const r = (raw ?? {}) as Partial<Settings> & { dailyCap?: number; monthlyCap?: number };
  return {
    model: r.model ?? DEFAULTS.model,
    apiKey: r.apiKey ?? DEFAULTS.apiKey,
    apiBase: r.apiBase ?? DEFAULTS.apiBase,
    defaultTone: r.defaultTone ?? DEFAULTS.defaultTone,
    motion: r.motion ?? DEFAULTS.motion,
    darkMode: r.darkMode ?? DEFAULTS.darkMode,
    userDailyCapUsd: r.userDailyCapUsd ?? r.dailyCap ?? DEFAULTS.userDailyCapUsd,
    userMonthlyCapUsd: r.userMonthlyCapUsd ?? r.monthlyCap ?? DEFAULTS.userMonthlyCapUsd,
  };
}

export function useSettings(): [Settings, (next: Partial<Settings>) => void] {
  const [s, setS] = useState<Settings>(DEFAULTS);
  useEffect(() => {
    const raw = loadJSON<unknown>(KEY, DEFAULTS);
    setS(migrateSettings(raw));
  }, []);
  return [s, (next) => {
    setS((prev) => {
      const merged = { ...prev, ...next };
      saveJSON(KEY, merged);
      return merged;
    });
  }];
}
