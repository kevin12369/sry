import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FAQ } from '@/components/FAQ';

describe('<FAQ /> (PR #4)', () => {
  it('renders the section heading', () => {
    render(<FAQ />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/常见疑问/);
  });

  it('renders 5 <details> elements', () => {
    const { container } = render(<FAQ />);
    const details = container.querySelectorAll('details');
    expect(details).toHaveLength(5);
  });

  it('each FAQ has a unique question starting with Qn.', () => {
    render(<FAQ />);
    expect(screen.getByText(/Q1\./)).toBeInTheDocument();
    expect(screen.getByText(/Q5\./)).toBeInTheDocument();
  });
});