import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UsagePanel } from '@/components/UsagePanel';
import type { Usage } from '@/lib/usage';

const FAKE_USAGE: Usage = {
  daily: { cap: 8000, used: 1200, remaining: 6800, resets_at: '2099-01-01T00:00:00Z' },
  monthly: { cap: 240000, used: 45000, remaining: 195000, resets_at: '2099-02-01T00:00:00Z' },
};

describe('<UsagePanel />', () => {
  it('renders daily + monthly buckets with caps and used', () => {
    render(<UsagePanel usage={FAKE_USAGE} loading={false} error={null} onRetry={vi.fn()} />);
    expect(screen.getByText(/1,200/)).toBeInTheDocument();
    expect(screen.getByText(/8,000/)).toBeInTheDocument();
    expect(screen.getByText(/45,000/)).toBeInTheDocument();
  });

  it('shows warning style when remaining < 20% of cap', () => {
    const low: Usage = {
      daily: { cap: 8000, used: 7500, remaining: 500, resets_at: '2099-01-01T00:00:00Z' },
      monthly: { cap: 240000, used: 50000, remaining: 190000, resets_at: '2099-02-01T00:00:00Z' },
    };
    const { container } = render(<UsagePanel usage={low} loading={false} error={null} onRetry={vi.fn()} />);
    expect(container.querySelector('[data-usage-warning="true"]')).toBeInTheDocument();
  });

  it('shows "查询失败" with retry button on error', () => {
    const retry = vi.fn();
    render(<UsagePanel usage={null} loading={false} error="boom" onRetry={retry} />);
    expect(screen.getByText(/查询失败/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/重试/));
    expect(retry).toHaveBeenCalled();
  });

  it('shows "正在查询…" while loading and no usage', () => {
    render(<UsagePanel usage={null} loading={true} error={null} onRetry={vi.fn()} />);
    expect(screen.getByText(/正在查询/)).toBeInTheDocument();
  });

  it('shows "今日已用完" when remaining is 0', () => {
    const zero: Usage = {
      daily: { cap: 8000, used: 8000, remaining: 0, resets_at: '2099-01-01T00:00:00Z' },
      monthly: { cap: 240000, used: 50000, remaining: 190000, resets_at: '2099-02-01T00:00:00Z' },
    };
    render(<UsagePanel usage={zero} loading={false} error={null} onRetry={vi.fn()} />);
    expect(screen.getByText(/今日已用完/)).toBeInTheDocument();
  });
});
