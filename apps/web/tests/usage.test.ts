import { describe, it, expect, vi, beforeAll } from 'vitest';
import { getUsage, formatResetsIn, type Usage } from '@/lib/usage';

beforeAll(() => {
  Object.defineProperty(window, 'fetch', { value: vi.fn(), writable: true });
});

describe('getUsage', () => {
  it('fetches /api/usage with correct base', async () => {
    const mockFetch = vi.mocked(window.fetch);
    const fakeUsage: Usage = {
      daily: { cap: 8000, used: 100, remaining: 7900, resets_at: '2026-06-09T00:00:00.000Z' },
      monthly: { cap: 240000, used: 5000, remaining: 235000, resets_at: '2026-07-01T00:00:00.000Z' },
    };
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(fakeUsage), { status: 200 }));
    const result = await getUsage('https://api.example.com');
    expect(result).toEqual(fakeUsage);
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/api/usage', expect.any(Object));
  });

  it('throws on non-200', async () => {
    const mockFetch = vi.mocked(window.fetch);
    mockFetch.mockResolvedValueOnce(new Response('err', { status: 500 }));
    await expect(getUsage('https://api.example.com')).rejects.toThrow();
  });
});

describe('formatResetsIn', () => {
  it('formats hours and minutes for future time', () => {
    const now = new Date('2026-06-08T15:30:00Z');
    const reset = '2026-06-08T20:45:00Z';
    expect(formatResetsIn(reset, now)).toBe('5h 15m');
  });

  it('formats minutes only for under-1-hour', () => {
    const now = new Date('2026-06-08T15:30:00Z');
    const reset = '2026-06-08T15:45:00Z';
    expect(formatResetsIn(reset, now)).toBe('15m');
  });

  it('returns "0m" for past time', () => {
    const now = new Date('2026-06-08T15:30:00Z');
    const reset = '2026-06-08T15:00:00Z';
    expect(formatResetsIn(reset, now)).toBe('0m');
  });
});
