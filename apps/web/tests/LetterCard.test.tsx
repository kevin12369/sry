import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LetterCard } from '../src/components/LetterCard.js';
import { ToastProvider } from '../src/components/ui/toast.js';

describe('LetterCard', () => {
  it('renders the body and word count', () => {
    render(<LetterCard style="funny" body="这是搞笑内容" loading={false} onRetry={() => {}} />, { wrapper: ToastProvider });
    expect(screen.getByText('这是搞笑内容')).toBeInTheDocument();
    expect(screen.getByText(/6 字/)).toBeInTheDocument();
  });

  it('shows a retry button when body is empty (failed)', () => {
    const onRetry = vi.fn();
    render(<LetterCard style="funny" body="" loading={false} onRetry={onRetry} />, { wrapper: ToastProvider });
    const btn = screen.getByRole('button', { name: /重试|换一版/ });
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledWith('funny');
  });
});
