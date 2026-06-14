import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

vi.mock('@/hooks/useGenerate', () => ({
  useGenerate: () => ({ state: { stage: 'idle' }, compose: vi.fn(), reset: vi.fn() }),
}));

vi.mock('@/hooks/useShare', () => ({
  useShareHash: () => null,
  useMemeHash: () => null,
}));

describe('<Page /> smoke', () => {
  it('renders the scene form first', () => {
    render(<Page />);
    // PR #4: Hero 段也含 "Sry.lol" / "嘴替游乐场",SceneForm 3 步问题唯一
    expect(screen.getByText(/今晚要当什么角色/)).toBeInTheDocument();
  });

  it('shows a feedback email link in the footer', () => {
    render(<Page />);
    const link = screen.getByRole('link', { name: /491750329@qq.com/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'mailto:491750329@qq.com');
  });
});
