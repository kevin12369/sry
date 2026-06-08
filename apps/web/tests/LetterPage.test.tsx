import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LetterPage } from '@/components/LetterPage';

describe('<LetterPage />', () => {
  it('renders body inside a paper container with a postmark', () => {
    render(
      <LetterPage
        style="sincere"
        body="老王,对不起"
        allLetters={{ funny: '', sincere: '', shameless: '', 'legal-cold': '', 'silent-treatment': '' }}
        onRetry={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('老王,对不起')).toBeInTheDocument();
    expect(screen.getByText(/🤝/)).toBeInTheDocument();
    expect(screen.getByText('真诚')).toBeInTheDocument();
  });
});
