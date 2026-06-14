import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FunElements } from '@/components/FunElements';

const EXPECTED_TITLES = [
  'SPIN 选人设',
  'AI 损友点评',
  '6 场景',
  'Share-as-meme',
  '已读不回动画',
];

describe('<FunElements /> (PR #4)', () => {
  it('renders all 5 fun-element card titles', () => {
    render(<FunElements />);
    for (const title of EXPECTED_TITLES) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('renders 5 screenshot placeholders', () => {
    const { container } = render(<FunElements />);
    const placeholders = container.querySelectorAll('[data-screenshot-placeholder]');
    expect(placeholders).toHaveLength(5);
  });

  it('uses emojis for each card', () => {
    render(<FunElements />);
    // SPIN = 🎲, AI 损友 = 🤖, 6 场景 = 🎭, Share = 📤, 已读不回 = 👻
    expect(screen.getByText('🎲')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('🎭')).toBeInTheDocument();
    expect(screen.getByText('📤')).toBeInTheDocument();
    expect(screen.getByText('👻')).toBeInTheDocument();
  });

  it('orders cards 1-5 via data-fun-card attribute', () => {
    const { container } = render(<FunElements />);
    for (let i = 1; i <= 5; i++) {
      expect(container.querySelector(`[data-fun-card="${i}"]`)).toBeInTheDocument();
    }
  });

  it('shows a section heading explaining the section', () => {
    render(<FunElements />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/好玩/);
  });
});