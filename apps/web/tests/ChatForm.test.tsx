import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatForm } from '@/components/ChatForm';

describe('<ChatForm />', () => {
  it('walks 4 steps and calls onSubmit with mapped personality', () => {
    const onSubmit = vi.fn();
    render(<ChatForm onSubmit={onSubmit} />);

    // step 1
    fireEvent.change(screen.getByLabelText('情境'), { target: { value: '我把室友的猫放跑了, 他很生气' } });
    fireEvent.click(screen.getByText(/下一步/));

    // step 2
    fireEvent.click(screen.getByLabelText('朋友'));
    fireEvent.click(screen.getByText(/下一步/));

    // step 3
    fireEvent.click(screen.getByLabelText('真诚道歉'));
    fireEvent.click(screen.getByText(/下一步/));

    // step 4
    fireEvent.click(screen.getByLabelText('真诚'));
    fireEvent.click(screen.getByText(/寄出/));

    expect(onSubmit).toHaveBeenCalledOnce();
    const value = onSubmit.mock.calls[0][0];
    expect(value.personality).toBe('sensitive');
    expect(value.situation).toContain('放跑');
  });

  it('rejects too-short situation', () => {
    const onSubmit = vi.fn();
    render(<ChatForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('情境'), { target: { value: 'hi' } });
    fireEvent.click(screen.getByText(/下一步/));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/至少写 5 个字/)).toBeInTheDocument();
  });
});
