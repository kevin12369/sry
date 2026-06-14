import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/Hero';

describe('<Hero /> (PR #4)', () => {
  it('renders the main h1 with the project name', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain('Sry.lol');
    expect(h1.textContent).toContain('嘴替游乐场');
  });

  it('renders both CTA buttons with correct anchor targets', () => {
    render(<Hero />);
    const tryBtn = screen.getByRole('link', { name: /Try live demo/ });
    expect(tryBtn).toHaveAttribute('href', '#demo');
    const stylesBtn = screen.getByRole('link', { name: /View 5 styles/ });
    expect(stylesBtn).toHaveAttribute('href', '#style-compare');
  });

  it('renders the pain-point callout with key use-cases', () => {
    render(<Hero />);
    expect(screen.getByText(/不会骂人/)).toBeInTheDocument();
    expect(screen.getByText(/不会道歉/)).toBeInTheDocument();
  });
});