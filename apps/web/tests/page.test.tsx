import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

vi.mock('@/hooks/useGenerate', () => ({
  useGenerate: () => ({ loading: false, error: null, data: null, run: vi.fn() }),
}));

describe('<Page /> smoke', () => {
  beforeEach(() => { window.location.hash = ''; });

  it('renders the chat form first', () => {
    render(<Page />);
    expect(screen.getByText(/嘴笨助手/)).toBeInTheDocument();
    expect(screen.getByText(/发生了什么/)).toBeInTheDocument();
  });

  it('shows a feedback email link in the footer', () => {
    render(<Page />);
    const link = screen.getByRole('link', { name: /491750329@qq.com/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'mailto:491750329@qq.com');
  });
});
