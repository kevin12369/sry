import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { MailShareCard } from '@/components/MailShareCard';

describe('<MailShareCard />', () => {
  it('renders the 5 letters in a paper container', () => {
    render(
      <MailShareCard
        letters={{ funny: 'a', sincere: 'b', shameless: 'c', 'legal-cold': 'd', 'silent-treatment': 'e' }}
        situation="我把猫放跑了"
        personality="sensitive"
        onWriteOwn={vi.fn()}
      />,
    );
    expect(screen.getByText(/分享视图/)).toBeInTheDocument();
    expect(screen.getByText(/我把猫放跑了/)).toBeInTheDocument();
    expect(screen.getByText('a')).toBeInTheDocument();
  });

  it('calls onWriteOwn when button clicked', () => {
    const cb = vi.fn();
    render(
      <MailShareCard
        letters={{ funny: 'a', sincere: 'b', shameless: 'c', 'legal-cold': 'd', 'silent-treatment': 'e' }}
        situation="x" personality="sensitive" onWriteOwn={cb}
      />,
    );
    fireEvent.click(screen.getByText(/我也写一封/));
    expect(cb).toHaveBeenCalledOnce();
  });
});
