import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_BYOK, loadByok, saveByok, clearByok } from '@/lib/byok';

beforeEach(() => {
  window.localStorage.clear();
});

describe('byok storage', () => {
  it('returns null when nothing stored', () => {
    expect(loadByok()).toBeNull();
  });

  it('round-trips a valid config', () => {
    const cfg = { baseUrl: 'https://api.openai.com/v1', apiKey: 'sk-x', model: 'gpt-4o-mini', enabled: true };
    saveByok(cfg);
    expect(loadByok()).toEqual(cfg);
  });

  it('clearByok removes the entry', () => {
    saveByok({ ...DEFAULT_BYOK, enabled: true });
    expect(loadByok()).not.toBeNull();
    clearByok();
    expect(loadByok()).toBeNull();
  });

  it('migrates partial config (missing fields default)', () => {
    window.localStorage.setItem('sry:byok', JSON.stringify({ enabled: true }));
    const out = loadByok();
    expect(out).not.toBeNull();
    expect(out!.enabled).toBe(true);
    expect(out!.baseUrl).toBe(DEFAULT_BYOK.baseUrl);
    expect(out!.model).toBe(DEFAULT_BYOK.model);
    expect(typeof out!.apiKey).toBe('string');
  });

  it('coerces non-boolean enabled to false', () => {
    window.localStorage.setItem('sry:byok', JSON.stringify({ ...DEFAULT_BYOK, enabled: 'yes' }));
    expect(loadByok()!.enabled).toBe(false);
  });

  it('survives garbage JSON', () => {
    window.localStorage.setItem('sry:byok', '{not-json');
    expect(loadByok()).toBeNull();
  });

  it('DEFAULT_BYOK is disabled with ollama base', () => {
    expect(DEFAULT_BYOK.enabled).toBe(false);
    expect(DEFAULT_BYOK.baseUrl).toContain('localhost:11434');
    expect(DEFAULT_BYOK.model).toBeTruthy();
  });
});