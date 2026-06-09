import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LetterPage } from '@/components/LetterPage';

describe('<LetterPage />', () => {
  const props = {
    style: 'sincere' as const,
    body: '老王,对不起',
    allLetters: { funny: 'a', sincere: 'b', shameless: 'c', 'legal-cold': 'd', 'silent-treatment': 'e' },
    onRetry: vi.fn(),
    onClose: vi.fn(),
    onPrev: vi.fn(),
    onNext: vi.fn(),
    currentIndex: 2,
    totalCount: 5,
  };

  it('renders body inside a paper container with a postmark', () => {
    render(<LetterPage {...props} />);
    expect(screen.getByText('老王,对不起')).toBeInTheDocument();
    expect(screen.getByText(/🤝/)).toBeInTheDocument();
    expect(screen.getByText('真诚')).toBeInTheDocument();
  });

  it('shows a greeting line (致 ...)', () => {
    render(<LetterPage {...props} />);
    expect(screen.getByText(/^致/)).toBeInTheDocument();
  });

  it('shows the 3-button navigation with current/total', () => {
    render(<LetterPage {...props} />);
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(screen.getByText(/上一封/)).toBeInTheDocument();
    expect(screen.getByText(/下一封/)).toBeInTheDocument();
    expect(screen.getByText(/返回信堆/)).toBeInTheDocument();
  });

  it('calls onPrev when 上一封 clicked', () => {
    render(<LetterPage {...props} />);
    fireEvent.click(screen.getByText(/上一封/));
    expect(props.onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when 下一封 clicked', () => {
    render(<LetterPage {...props} />);
    fireEvent.click(screen.getByText(/下一封/));
    expect(props.onNext).toHaveBeenCalledOnce();
  });
});
