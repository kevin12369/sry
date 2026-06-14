import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Roadmap } from '@/components/Roadmap';

describe('<Roadmap /> (PR #4)', () => {
  it('renders the section heading', () => {
    render(<Roadmap />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/路线图/);
  });

  it('renders 3 phases (v1/v2/v3) with status badges', () => {
    const { container } = render(<Roadmap />);
    expect(container.querySelector('[data-phase="v1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-phase="v2"]')).toBeInTheDocument();
    expect(container.querySelector('[data-phase="v3"]')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText('Planned')).toBeInTheDocument();
  });
});