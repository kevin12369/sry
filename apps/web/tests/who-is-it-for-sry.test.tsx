import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhoIsItFor } from '@/components/WhoIsItFor';

const EXPECTED_PERSONAS = ['轻度社恐', '朋友圈梗图贡献者', '短视频博主'];

describe('<WhoIsItFor /> (PR #4)', () => {
  it('renders all 3 persona titles', () => {
    render(<WhoIsItFor />);
    for (const p of EXPECTED_PERSONAS) {
      expect(screen.getByText(p)).toBeInTheDocument();
    }
  });

  it('renders a quote (blockquote) for each persona', () => {
    render(<WhoIsItFor />);
    const quotes = screen.getAllByRole('blockquote');
    expect(quotes).toHaveLength(3);
  });

  it('marks each persona with a data-persona attribute 1-3', () => {
    const { container } = render(<WhoIsItFor />);
    for (let i = 1; i <= 3; i++) {
      expect(container.querySelector(`[data-persona="${i}"]`)).toBeInTheDocument();
    }
  });

  // PR #1 P0: padding 改 p-5 md:p-6(原 p-8/p-10)
  it('persona cards use p-5 md:p-6 padding (PR #1 P0)', () => {
    const { container } = render(<WhoIsItFor />);
    const articles = container.querySelectorAll('article[data-persona]');
    expect(articles).toHaveLength(3);
    for (const a of Array.from(articles)) {
      expect(a.className).toMatch(/\bp-5\b/);
      expect(a.className).toMatch(/\bmd:p-6\b/);
      expect(a.className).not.toMatch(/\bp-8\b/);
      expect(a.className).not.toMatch(/\bp-10\b/);
    }
  });
});