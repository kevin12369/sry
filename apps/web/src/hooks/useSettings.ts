'use client';
import { useEffect, useState } from 'react';
import { loadJSON, saveJSON } from '@/lib/storage';
import type { ModelId } from '@sry/shared';

export interface Settings {
  model: ModelId;
  apiKey: string;
  dailyCap: number;
  monthlyCap: number;
}

const KEY = 'sry:settings:v1';

const DEFAULTS: Settings = {
  model: 'workers-ai',
  apiKey: '',
  dailyCap: 0,
  monthlyCap: 0,
};

export function useSettings(): [Settings, (next: Partial<Settings>) => void] {
  const [s, setS] = useState<Settings>(DEFAULTS);
  useEffect(() => { setS(loadJSON(KEY, DEFAULTS)); }, []);
  return [s, (next) => {
    setS((prev) => {
      const merged = { ...prev, ...next };
      saveJSON(KEY, merged);
      return merged;
    });
  }];
}
