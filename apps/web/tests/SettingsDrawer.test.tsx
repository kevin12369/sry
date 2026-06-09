import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsDrawer } from '../src/components/SettingsDrawer.js';

describe('SettingsDrawer', () => {
  it('saves the api key on blur and persists to localStorage', () => {
    const setSpy = vi.spyOn(window.localStorage, 'setItem');
    render(<SettingsDrawer open={true} onClose={() => {}} settings={{ model: 'workers-ai', apiKey: '', apiBase: 'https://sry-worker.491750329.workers.dev', defaultTone: '真诚', motion: 'auto', darkMode: 'light', userDailyCapUsd: 0, userMonthlyCapUsd: 0 }} onChange={() => {}} />);
    fireEvent.change(screen.getByLabelText(/API Key/), { target: { value: 'sk-test' } });
    fireEvent.blur(screen.getByLabelText(/API Key/));
    expect(setSpy).toHaveBeenCalled();
  });
});
