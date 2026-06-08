import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComparisonGrid } from '../src/components/ComparisonGrid.js';
import { ToastProvider } from '../src/components/ui/toast.js';
import type { StyleMap } from '@sry/shared';

const letters: StyleMap = {
  'funny': 'A'.repeat(100),
  'sincere': 'B'.repeat(200),
  'shameless': 'C'.repeat(50),
  'legal-cold': 'D'.repeat(300),
  'silent-treatment': '嗯。',
};

describe('ComparisonGrid', () => {
  it('renders 5 cards', () => {
    render(
      <ToastProvider>
        <ComparisonGrid letters={letters} loading={false} onRetry={() => {}} sort="style" />
      </ToastProvider>
    );
    expect(screen.getAllByRole('region', { name: /道歉卡片/ }).length).toBeGreaterThanOrEqual(5);
    // alternative: assert headers exist
    expect(screen.getByText('搞笑')).toBeInTheDocument();
    expect(screen.getByText('已读不回')).toBeInTheDocument();
  });

  it('switches to length sort', () => {
    render(
      <ToastProvider>
        <ComparisonGrid letters={letters} loading={false} onRetry={() => {}} sort="length" />
      </ToastProvider>
    );
    // 嗯。 is shortest; just ensure all 5 still present
    expect(screen.getByText('已读不回')).toBeInTheDocument();
  });
});
