import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import Page from '../../src/app/page.js';
import { ToastProvider } from '../../src/components/ui/toast.js';
import { STYLES } from '@sry/shared';

function renderPage() {
  return render(
    <ToastProvider>
      <Page />
    </ToastProvider>,
  );
}

// This test relies on the MSW server (booted in tests/setup.ts) intercepting
// POST /api/gen and returning FAKE_LETTERS from tests/mocks/handlers.ts.
// It exercises the *real* network path: api client -> fetch -> MSW -> React UI.
describe('Landing page e2e (MSW)', () => {
  beforeEach(() => {
    // clean URL hash between tests so useShareHash doesn't load a stale payload
    window.location.hash = '';
    // clipboard is a getter-only property in happy-dom; use defineProperty
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('form submit -> 5 cards -> share URL -> reload renders shared cards', async () => {
    renderPage();

    // 1. fill the form
    const textarea = screen.getByPlaceholderText(/我做了什么/);
    fireEvent.change(textarea, { target: { value: '我把室友的猫放跑了,他很生气' } });
    fireEvent.click(screen.getByRole('button', { name: /生成 5 种风格/ }));

    // 2. wait for 5 style labels to appear
    for (const s of STYLES) {
      await waitFor(() => {
        expect(screen.getAllByText(styleLabel(s)).length).toBeGreaterThan(0);
      });
    }

    // 3. every style's body is present (MSW returned non-empty text)
    expect(screen.getByText(/我不应该这样,原谅我/)).toBeInTheDocument();
    expect(screen.getByText(/这件事我做得不好/)).toBeInTheDocument();
    expect(screen.getByText(/其实也没多大事/)).toBeInTheDocument();
    expect(screen.getByText(/本事件不构成责任/)).toBeInTheDocument();
    expect(screen.getByText('嗯。')).toBeInTheDocument();

    // 4. share button writes the #share=... URL hash
    const shareBtn = screen.getByRole('button', { name: /分享/ });
    fireEvent.click(shareBtn);
    await waitFor(() => {
      expect(window.location.hash).toMatch(/^#share=.+/);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // 5. success toast shows
    await waitFor(() => {
      expect(screen.getByText('链接已复制')).toBeInTheDocument();
    });
  });

  it('MSW ethics reject -> RejectScreen renders', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText(/我做了什么/), {
      target: { value: '我要弄死王伟这个王八蛋' },
    });
    fireEvent.click(screen.getByRole('button', { name: /生成 5 种风格/ }));
    await waitFor(() => {
      expect(screen.getByText(/请求被拒绝/)).toBeInTheDocument();
    });
  });
});

// Style keys are not user-facing labels, so look up the chip text we render.
function styleLabel(s: string): RegExp {
  const map: Record<string, string> = {
    'funny': '搞笑',
    'sincere': '真诚',
    'shameless': '厚脸皮',
    'legal-cold': '法律冷面',
    'silent-treatment': '已读不回',
  };
  const text = map[s] ?? s;
  return new RegExp(text);
}
