import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { LetterActions } from '@/components/LetterActions';
import { type StyleMap } from '@sry/shared';

beforeAll(() => {
  // clipboard is a getter-only property in happy-dom; use defineProperty
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

describe('<LetterActions />', () => {
  it('copy-this calls clipboard.writeText with body', async () => {
    const all: StyleMap = {
      funny: '', sincere: '', shameless: '', 'legal-cold': '', 'silent-treatment': '',
    };
    render(<LetterActions body="老王,对不起" allLetters={all} onRetry={vi.fn()} onClose={vi.fn()} />);
    await act(async () => { fireEvent.click(screen.getByText(/复制这封/)); });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('老王,对不起');
  });

  it('copy-all calls clipboard.writeText with all 5 joined', async () => {
    const all: StyleMap = {
      funny: 'a', sincere: 'b', shameless: 'c', 'legal-cold': 'd', 'silent-treatment': 'e',
    };
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockClear();
    render(<LetterActions body="a" allLetters={all} onRetry={vi.fn()} onClose={vi.fn()} />);
    await act(async () => { fireEvent.click(screen.getByText(/复制全部/)); });
    const written = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0];
    // Should contain 5 【label】\nbody entries
    expect(written).toContain('【搞笑】\na');
    expect(written).toContain('【真诚】\nb');
    expect(written).toContain('【耍赖】\nc');
    expect(written).toContain('【法务冷面】\nd');
    expect(written).toContain('【已读不回】\ne');
    // All 5 separated by \n\n
    expect(written.split('\n\n').length).toBe(5);
  });
});
