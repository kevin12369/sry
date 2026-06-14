import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StyleCompare } from '@/components/StyleCompare';
import { STYLES, STYLE_NAMES_ZH } from '@/data/prompts';

describe('<StyleCompare /> (PR #4)', () => {
  it('renders all 5 style cards', () => {
    render(<StyleCompare />);
    for (const s of STYLES) {
      expect(screen.getByText(STYLE_NAMES_ZH[s])).toBeInTheDocument();
    }
  });

  it('renders AI roast badge for each style', () => {
    render(<StyleCompare />);
    // 5 损友点评标签
    const labels = screen.getAllByText(/AI 损友点评/);
    expect(labels).toHaveLength(5);
  });

  it('sets the section id so Hero CTA can anchor here', () => {
    const { container } = render(<StyleCompare />);
    const section = container.querySelector('#style-compare');
    expect(section).toBeInTheDocument();
  });
});