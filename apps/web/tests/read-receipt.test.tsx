import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ReadReceipt } from '@/components/ReadReceipt';

describe('<ReadReceipt /> (PR #3) — 4 state timing', () => {
  it('starts in "typing" phase, advances to "sent", then "read", then "silence"', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<ReadReceipt onComplete={onComplete} />);
    const root = document.querySelector('[data-read-receipt]');
    expect(root?.getAttribute('data-phase')).toBe('typing');

    act(() => { vi.advanceTimersByTime(800); });
    expect(root?.getAttribute('data-phase')).toBe('sent');

    act(() => { vi.advanceTimersByTime(900); });
    expect(root?.getAttribute('data-phase')).toBe('read');

    act(() => { vi.advanceTimersByTime(800); });
    expect(root?.getAttribute('data-phase')).toBe('silence');

    expect(screen.getByText(/对方没回/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('calls onComplete after the full ~3.5s sequence', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<ReadReceipt onComplete={onComplete} />);
    act(() => { vi.advanceTimersByTime(3500); });
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('clears timers on unmount without throwing', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const { unmount } = render(<ReadReceipt onComplete={onComplete} />);
    act(() => { vi.advanceTimersByTime(500); });
    expect(() => unmount()).not.toThrow();
    act(() => { vi.advanceTimersByTime(4000); });
    expect(onComplete).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});