import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { LetterStack } from '@/components/LetterStack';
import { STYLES, type StyleMap } from '@sry/shared';

const letters: StyleMap = {
  funny: '老王,哈哈,那事算了',
  sincere: '老王,对不起',
  shameless: '老王,我没错',
  'legal-cold': '致老王: ...',
  'silent-treatment': '(无回复)',
};

describe('<LetterStack />', () => {
  it('renders all 5 envelopes as a vertical list', () => {
    render(<LetterStack letters={letters} onOpen={vi.fn()} opened={null} />);
    for (const s of STYLES) {
      expect(screen.getByLabelText(new RegExp(s))).toBeInTheDocument();
    }
  });

  it('calls onOpen with style when an envelope row is clicked', () => {
    const onOpen = vi.fn();
    render(<LetterStack letters={letters} onOpen={onOpen} opened={null} />);
    fireEvent.click(screen.getByLabelText(/真诚/));
    expect(onOpen).toHaveBeenCalledWith('sincere');
  });

  it('marks the opened envelope with seal border via aria-pressed', () => {
    render(<LetterStack letters={letters} onOpen={vi.fn()} opened="sincere" />);
    const sincereButton = screen.getByLabelText(/真诚/);
    expect(sincereButton).toHaveAttribute('aria-pressed', 'true');
  });
});
