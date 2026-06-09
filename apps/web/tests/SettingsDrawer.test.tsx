import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { Drawer } from '@/components/ui/drawer';
import type { Settings } from '@/hooks/useSettings';

const STORAGE_KEY = 'sry:settings:v2';

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false }),
      writable: true,
    });
  }
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
});

beforeEach(() => {
  window.localStorage.clear();
});

const defaultSettings: Settings = {
  model: 'workers-ai',
  apiKey: '',
  apiBase: 'https://sry-worker.491750329.workers.dev',
  defaultTone: '真诚',
  motion: 'auto',
  darkMode: 'light',
  userDailyCapUsd: 0,
  userMonthlyCapUsd: 0,
};

describe('<SettingsDrawer />', () => {
  it('renders 3 sections: BYOK, 偏好, 危险区', () => {
    render(
      <Drawer open={true} onClose={() => {}}>
        <SettingsDrawer
          open={true}
          onClose={() => {}}
          settings={defaultSettings}
          onChange={() => {}}
        />
      </Drawer>
    );
    expect(screen.getByText(/BYOK/)).toBeInTheDocument();
    expect(screen.getByText(/偏好/)).toBeInTheDocument();
    expect(screen.getByText(/危险区/)).toBeInTheDocument();
  });

  it('shows all 4 models in 模型 dropdown', () => {
    render(
      <Drawer open={true} onClose={() => {}}>
        <SettingsDrawer open={true} onClose={() => {}} settings={defaultSettings} onChange={() => {}} />
      </Drawer>
    );
    const select = screen.getByLabelText('模型') as HTMLSelectElement;
    expect(select.options.length).toBe(4);
  });

  it('shows 默认语气 selector with 5 options', () => {
    render(
      <Drawer open={true} onClose={() => {}}>
        <SettingsDrawer open={true} onClose={() => {}} settings={defaultSettings} onChange={() => {}} />
      </Drawer>
    );
    const sel = screen.getByLabelText('默认语气') as HTMLSelectElement;
    expect(sel.options.length).toBe(5);
  });

  it('清除缓存 button calls localStorage.clear + reload', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', { value: { reload: reloadMock }, configurable: true });
    window.localStorage.setItem(STORAGE_KEY, '{"foo":1}');

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <Drawer open={true} onClose={() => {}}>
        <SettingsDrawer open={true} onClose={() => {}} settings={defaultSettings} onChange={() => {}} />
      </Drawer>
    );
    fireEvent.click(screen.getByText(/清除缓存/));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(reloadMock).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
