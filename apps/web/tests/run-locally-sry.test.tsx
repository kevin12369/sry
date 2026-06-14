import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RunLocally } from '@/components/RunLocally';

describe('<RunLocally /> (PR #4)', () => {
  it('renders the section heading', () => {
    render(<RunLocally />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/本地跑起来/);
  });

  it('renders 3 commands in order', () => {
    const { container } = render(<RunLocally />);
    const cmds = container.querySelectorAll('[data-cmd]');
    expect(cmds).toHaveLength(3);
    expect(cmds[0]?.textContent).toContain('git clone');
    expect(cmds[1]?.textContent).toContain('pnpm install');
    expect(cmds[2]?.textContent).toContain('pnpm dev:web');
  });

  it('lists required and optional requirements', () => {
    render(<RunLocally />);
    expect(screen.getByText(/Node\.js 20\+/)).toBeInTheDocument();
    expect(screen.getByText(/pnpm 9\+/)).toBeInTheDocument();
    expect(screen.getByText(/Ollama 本地/)).toBeInTheDocument();
    expect(screen.getByText(/OpenAI key/)).toBeInTheDocument();
  });
});