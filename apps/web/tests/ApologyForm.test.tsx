import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { ApologyForm } from '../src/components/ApologyForm.js';

describe('ApologyForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('blocks submission with empty situation', async () => {
    const onSubmit = vi.fn();
    render(<ApologyForm loading={false} onSubmit={onSubmit} />);
    const form = screen.getByRole('form', { name: /道歉输入/ });
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText(/太短|至少 5/)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid input', async () => {
    const onSubmit = vi.fn();
    render(<ApologyForm loading={false} onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/我做了什么/) as HTMLTextAreaElement;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    nativeInputValueSetter?.call(textarea, '我把室友的猫放跑了');
    fireEvent.input(textarea, { target: { value: '我把室友的猫放跑了' } });
    fireEvent.click(screen.getByLabelText(/直率型/));
    const form = screen.getByRole('form', { name: /道歉输入/ });
    fireEvent.submit(form);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
    expect(onSubmit.mock.calls[0][0]).toEqual({ situation: '我把室友的猫放跑了', personality: 'direct' });
  });

  it('disables button while loading', () => {
    render(<ApologyForm loading={true} onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: /生成中/ })).toBeDisabled();
  });
});
