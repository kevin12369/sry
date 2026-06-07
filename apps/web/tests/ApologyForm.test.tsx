import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApologyForm } from '../src/components/ApologyForm.js';

describe('ApologyForm', () => {
  it('blocks submission with empty situation', () => {
    const onSubmit = vi.fn();
    render(<ApologyForm loading={false} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /生成 5 种风格/ }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/太短|至少 5/)).toBeInTheDocument();
  });

  it('submits valid input', () => {
    const onSubmit = vi.fn();
    render(<ApologyForm loading={false} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/我做了什么/), { target: { value: '我把室友的猫放跑了' } });
    fireEvent.click(screen.getByLabelText(/直率型/));
    fireEvent.click(screen.getByRole('button', { name: /生成 5 种风格/ }));
    expect(onSubmit).toHaveBeenCalledWith({ situation: '我把室友的猫放跑了', personality: 'direct' });
  });

  it('disables button while loading', () => {
    render(<ApologyForm loading={true} onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: /生成中/ })).toBeDisabled();
  });
});
