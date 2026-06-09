import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSettings, migrateSettings, type Settings } from '@/hooks/useSettings';
import { saveJSON } from '@/lib/storage';

const KEY = 'sry:settings:v2';

beforeEach(() => {
  window.localStorage.clear();
});

describe('useSettings v2', () => {
  it('returns full defaults on first load', () => {
    const { result } = renderHook(() => useSettings());
    const [s] = result.current;
    expect(s).toMatchObject({
      model: 'workers-ai',
      apiKey: '',
      apiBase: 'https://sry-worker.491750329.workers.dev',
      defaultTone: '真诚',
      motion: 'auto',
      darkMode: 'light',
      userDailyCapUsd: 0,
      userMonthlyCapUsd: 0,
    });
  });

  it('persists changes to localStorage key v2', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current[1]({ apiKey: 'sk-test' }));
    const stored = window.localStorage.getItem(KEY);
    expect(stored).toContain('sk-test');
  });
});

describe('migrateSettings', () => {
  it('migrates v1 (dailyCap/monthlyCap) to v2 (userXxxCapUsd)', () => {
    const v1 = { model: 'workers-ai', apiKey: 'sk-x', dailyCap: 5, monthlyCap: 100 };
    const v2 = migrateSettings(v1);
    expect(v2.userDailyCapUsd).toBe(5);
    expect(v2.userMonthlyCapUsd).toBe(100);
  });

  it('fills missing fields with defaults', () => {
    const v2 = migrateSettings({});
    expect(v2.apiBase).toBe('https://sry-worker.491750329.workers.dev');
    expect(v2.defaultTone).toBe('真诚');
  });
});
