import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PersonaRoulette } from '@/components/PersonaRoulette';

describe('<PersonaRoulette /> (PR #3)', () => {
  it('renders the SPIN button with accessible label', () => {
    render(<PersonaRoulette onSpin={() => {}} />);
    const btn = screen.getByRole('button', { name: /SPIN/ });
    expect(btn).toBeInTheDocument();
  });

  it('clicking SPIN triggers onSpin after the 1.5s spin animation', () => {
    vi.useFakeTimers();
    const onSpin = vi.fn();
    render(<PersonaRoulette onSpin={onSpin} />);
    const btn = screen.getByRole('button', { name: /SPIN/ });
    fireEvent.click(btn);
    expect(onSpin).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(onSpin).toHaveBeenCalledTimes(1);
    expect(typeof onSpin.mock.calls[0]?.[0]).toBe('string');
    vi.useRealTimers();
  });

  it('is disabled when the disabled prop is true', () => {
    render(<PersonaRoulette onSpin={() => {}} disabled />);
    const btn = screen.getByRole('button', { name: /SPIN/ });
    expect(btn).toBeDisabled();
  });
});