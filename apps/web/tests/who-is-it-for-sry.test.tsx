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
});