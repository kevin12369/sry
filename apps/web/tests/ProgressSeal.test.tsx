import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressSeal } from '@/components/ProgressSeal';

describe('<ProgressSeal />', () => {
  it('renders 4 stamp cells', () => {
    const { container } = render(<ProgressSeal current={1} total={4} />);
    const cells = container.querySelectorAll('[data-stamp]');
    expect(cells.length).toBe(4);
  });

  it('marks current cell with primary color', () => {
    const { container } = render(<ProgressSeal current={2} total={4} />);
    const current = container.querySelectorAll('[data-stamp]')[1];
    expect(current.className).toContain('bg-seal');
  });
});
