import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUsage } from '@/hooks/useUsage';

beforeAll(() => {
  Object.defineProperty(window, 'fetch', { value: vi.fn(), writable: true, configurable: true });
});

beforeEach(() => {
  vi.mocked(window.fetch).mockReset();
});

describe('useUsage', () => {
  it('fetches on mount', async () => {
    vi.mocked(window.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({
        daily: { cap: 8000, used: 0, remaining: 8000, resets_at: '2099-01-01T00:00:00Z' },
        monthly: { cap: 240000, used: 0, remaining: 240000, resets_at: '2099-02-01T00:00:00Z' },
      }), { status: 200 })
    );
    const { result } = renderHook(() => useUsage('https://api.example.com'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.usage?.daily.cap).toBe(8000);
  });

  it('exposes error on failure', async () => {
    vi.mocked(window.fetch).mockResolvedValueOnce(new Response('err', { status: 500 }));
    const { result } = renderHook(() => useUsage('https://api.example.com'));
    await waitFor(() => expect(result.current.error).not.toBeNull());
  });

  it('refresh re-fetches', async () => {
    vi.mocked(window.fetch).mockResolvedValue(
      new Response(JSON.stringify({
        daily: { cap: 8000, used: 0, remaining: 8000, resets_at: '2099-01-01T00:00:00Z' },
        monthly: { cap: 240000, used: 0, remaining: 240000, resets_at: '2099-02-01T00:00:00Z' },
      }), { status: 200 })
    );
    const { result } = renderHook(() => useUsage('https://api.example.com'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.refresh(); });
    expect(vi.mocked(window.fetch)).toHaveBeenCalledTimes(2);
  });
});
