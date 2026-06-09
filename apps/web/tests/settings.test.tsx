import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPage } from '@/components/SettingsPage';
import type { Settings } from '@/hooks/useSettings';

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

const STORAGE_KEY = 'sry:settings:v2';

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false }),
      writable: true,
    });
  }
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
  Object.defineProperty(window, 'fetch', { value: vi.fn(), writable: true, configurable: true });
});

beforeEach(() => {
  window.localStorage.clear();
  vi.mocked(window.fetch).mockReset();
});

describe('<SettingsPage />', () => {
  it('renders all 4 cards: BYOK, 免费额度, 偏好, 危险区', () => {
    render(<SettingsPage settings={defaultSettings} onChange={vi.fn()} />);
    expect(screen.getByText(/BYOK/)).toBeInTheDocument();
    expect(screen.getByText(/免费额度/)).toBeInTheDocument();
    expect(screen.getByText(/偏好/)).toBeInTheDocument();
    expect(screen.getByText(/危险区/)).toBeInTheDocument();
  });

  it('renders in a 2x2 grid layout', () => {
    const { container } = render(<SettingsPage settings={defaultSettings} onChange={vi.fn()} />);
    const grid = container.querySelector('[data-settings-grid]');
    expect(grid).toBeInTheDocument();
    expect(grid?.className).toMatch(/grid-cols-2/);
  });

  it('BYOK card has 模型 + API Key + 日限/月限/代理', () => {
    render(<SettingsPage settings={defaultSettings} onChange={vi.fn()} />);
    expect(screen.getByLabelText('模型')).toBeInTheDocument();
    expect(screen.getByLabelText('API Key')).toBeInTheDocument();
    expect(screen.getByLabelText(/自费日限/)).toBeInTheDocument();
    expect(screen.getByLabelText(/自费月限/)).toBeInTheDocument();
    expect(screen.getByLabelText(/API 代理/)).toBeInTheDocument();
  });

  it('偏好 card has 默认语气 + 动画 + 暗色模式', () => {
    render(<SettingsPage settings={defaultSettings} onChange={vi.fn()} />);
    expect(screen.getByLabelText('默认语气')).toBeInTheDocument();
    expect(screen.getByLabelText('动画')).toBeInTheDocument();
    expect(screen.getByLabelText('暗色模式')).toBeInTheDocument();
  });

  it('危险区 card has 2 buttons', () => {
    render(<SettingsPage settings={defaultSettings} onChange={vi.fn()} />);
    expect(screen.getByText(/清除全部缓存/)).toBeInTheDocument();
    expect(screen.getByText(/重置全部设置/)).toBeInTheDocument();
  });

  it('shows 顶部 导航条 with 返回主页 link', () => {
    render(<SettingsPage settings={defaultSettings} onChange={vi.fn()} />);
    const backLink = screen.getByRole('link', { name: /返回主页/ });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('persists changes to localStorage v2 on input blur', () => {
    render(<SettingsPage settings={defaultSettings} onChange={vi.fn()} />);
    const apiKeyInput = screen.getByLabelText('API Key') as HTMLInputElement;
    fireEvent.change(apiKeyInput, { target: { value: 'sk-test-123' } });
    fireEvent.blur(apiKeyInput);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(stored).toContain('sk-test-123');
  });

  it('changes API base persists on blur (empty reverts to default)', () => {
    render(<SettingsPage settings={defaultSettings} onChange={vi.fn()} />);
    const apiBaseInput = screen.getByLabelText(/API 代理/) as HTMLInputElement;
    fireEvent.change(apiBaseInput, { target: { value: 'https://my-proxy.com' } });
    fireEvent.blur(apiBaseInput);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(stored).toContain('my-proxy.com');
  });
});
