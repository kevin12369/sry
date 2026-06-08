import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { Envelope } from '@/components/Envelope';

describe('<Envelope />', () => {
  const props = {
    style: 'funny' as const,
    body: '老王,昨晚那事,哈哈',
    index: 0,
    expanded: false,
    onClick: vi.fn(),
  };

  it('shows the style emoji and a snippet when collapsed', () => {
    render(<Envelope {...props} />);
    expect(screen.getByText('😂')).toBeInTheDocument();
    expect(screen.getByText(/老王/)).toBeInTheDocument();
  });

  it('does not show full body when collapsed', () => {
    render(<Envelope {...props} />);
    expect(screen.queryByText('老王,昨晚那事,哈哈,我觉得吧')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<Envelope {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.onClick).toHaveBeenCalledOnce();
  });
});
