import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AllFailedScreen } from '../src/components/AllFailedScreen.js';

describe('AllFailedScreen', () => {
  it('renders friendly big-text fallback and a retry button', () => {
    const onRetry = vi.fn();
    render(<AllFailedScreen onRetry={onRetry} />);
    expect(screen.getByText(/服务暂时不可用/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /5 分钟后重试/ }));
    expect(onRetry).toHaveBeenCalled();
  });
});
