import { describe, it, expect } from 'vitest';
import {
  kvUsageKey, todayUtc, monthUtc, nextDailyResetUtc, nextMonthlyResetUtc,
  type Usage,
} from '@/router/usage';

describe('usage helpers', () => {
  it('kvUsageKey formats daily and monthly keys', () => {
    expect(kvUsageKey('daily', '2026-06-08')).toBe('sry:usage:daily:2026-06-08');
    expect(kvUsageKey('monthly', '2026-06')).toBe('sry:usage:monthly:2026-06');
  });

  it('todayUtc returns YYYY-MM-DD', () => {
    expect(todayUtc(new Date('2026-06-08T15:00:00Z'))).toBe('2026-06-08');
  });

  it('monthUtc returns YYYY-MM', () => {
    expect(monthUtc(new Date('2026-06-08T15:00:00Z'))).toBe('2026-06');
  });

  it('nextDailyResetUtc returns tomorrow 00:00 UTC', () => {
    const now = new Date('2026-06-08T15:30:00Z');
    const next = new Date(nextDailyResetUtc(now));
    expect(next.toISOString()).toBe('2026-06-09T00:00:00.000Z');
  });

  it('nextMonthlyResetUtc returns next month 1st 00:00 UTC', () => {
    const now = new Date('2026-06-08T15:30:00Z');
    const next = new Date(nextMonthlyResetUtc(now));
    expect(next.toISOString()).toBe('2026-07-01T00:00:00.000Z');
  });
});

describe('Usage type', () => {
  it('has cap / used / remaining / resets_at fields', () => {
    const u: Usage = {
      daily: { cap: 8000, used: 100, remaining: 7900, resets_at: '2026-06-09T00:00:00.000Z' },
      monthly: { cap: 240000, used: 5000, remaining: 235000, resets_at: '2026-07-01T00:00:00.000Z' },
    };
    expect(u.daily.cap).toBe(8000);
    expect(u.daily.remaining).toBe(7900);
  });
});
