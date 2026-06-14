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

  // PR #1 P0: article 卡 min-height 锁 280,emoji 锁 w-10 h-10(40px)
  it('article cards have min-height 280 and emoji uses w-10 h-10 box (PR #1 P0)', () => {
    const { container } = render(<StyleCompare />);
    const articles = container.querySelectorAll('article[data-style]');
    expect(articles).toHaveLength(5);
    for (const a of Array.from(articles)) {
      expect(a.className).toMatch(/min-h-\[280px\]/);
      const emojiBox = a.querySelector('[aria-hidden="true"]');
      expect(emojiBox).not.toBeNull();
      expect(emojiBox?.className).toMatch(/\bw-10\b/);
      expect(emojiBox?.className).toMatch(/\bh-10\b/);
    }
  });
});