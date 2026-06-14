import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';

describe('<Footer /> (PR #4)', () => {
  it('renders 4 column headings', () => {
    render(<Footer />);
    for (const t of ['Brand', 'Project', 'Documentation', 'Author']) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
  });

  it('shows author email link in Author column', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: '491750329@qq.com' });
    expect(link).toHaveAttribute('href', 'mailto:491750329@qq.com');
  });

  it('renders copyright line with privacy line', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Sry\.lol/)).toBeInTheDocument();
    expect(screen.getByText(/隐私:零数据收集/)).toBeInTheDocument();
  });
});