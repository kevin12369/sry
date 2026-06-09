import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { EnvelopeRow } from '@/components/Envelope';

describe('<EnvelopeRow />', () => {
  const props = {
    style: 'funny' as const,
    body: '老王,昨晚那事,哈哈,我觉得吧',
    isOpen: false,
    onClick: vi.fn(),
  };

  it('shows the style emoji, Chinese label, and body snippet', () => {
    render(<EnvelopeRow {...props} />);
    expect(screen.getByText('😂')).toBeInTheDocument();
    expect(screen.getByText('搞笑')).toBeInTheDocument();
    expect(screen.getByText(/老王,昨晚那事,哈哈/)).toBeInTheDocument();
  });

  it('truncates long body with ellipsis', () => {
    const longBody = 'x'.repeat(50);
    render(<EnvelopeRow {...props} body={longBody} />);
    expect(screen.getByText(/x+\.\.\./)).toBeInTheDocument();
  });

  it('does not show ellipsis for short body', () => {
    const shortBody = 'x'.repeat(20);
    render(<EnvelopeRow {...props} body={shortBody} />);
    expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
  });

  it('shows full body when isOpen=true (no truncation)', () => {
    const longBody = 'y'.repeat(50);
    render(<EnvelopeRow {...props} body={longBody} isOpen={true} />);
    expect(screen.getByText(longBody)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<EnvelopeRow {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.onClick).toHaveBeenCalledOnce();
  });
});
