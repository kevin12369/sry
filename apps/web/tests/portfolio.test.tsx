import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Portfolio from '@/app/portfolio/page';

describe('Portfolio page', () => {
  it('renders the project name and tagline', () => {
    const { container } = render(<Portfolio />);
    const main = container.querySelector('main')!;
    expect(within(main).getByRole('heading', { name: /嘴笨助手/ })).toBeInTheDocument();
    expect(within(main).getByText('5 种风格的道歉信生成器')).toBeInTheDocument();
  });

  it('renders the demo screenshot image', () => {
    render(<Portfolio />);
    const img = screen.getByRole('img', { name: /demo screenshot/i });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toContain('main.png');
  });

  it('has a link to RUN-LOCALLY.md', () => {
    const { container } = render(<Portfolio />);
    const main = container.querySelector('main')!;
    const link = within(main).getByRole('link', { name: /RUN-LOCALLY\.md/ });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toContain('RUN-LOCALLY');
  });
});
