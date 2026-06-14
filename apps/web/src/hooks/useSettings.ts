'use client';
import { useEffect, useState } from 'react';
import { loadJSON, saveJSON } from '@/lib/storage';

export type Tone = '搞笑' | '真诚' | '耍赖' | '法务' | '已读不回';

export interface Settings {
  defaultTone: Tone;
  motion: 'auto' | 'on' | 'off';
}

const KEY = 'sry:settings:v2';

export const DEFAULTS: Settings = {
  defaultTone: '真诚',
  motion: 'auto',
};

export function migrateSettings(raw: unknown): Settings {
  const r = (raw ?? {}) as Partial<Settings> & Record<string, unknown>;
  return {
    defaultTone: (r.defaultTone as Tone | undefined) ?? DEFAULTS.defaultTone,
    motion: (r.motion as 'auto' | 'on' | 'off' | undefined) ?? DEFAULTS.motion,
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
