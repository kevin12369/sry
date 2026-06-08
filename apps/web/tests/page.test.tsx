import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import Page from '../src/app/page.js';
import { ToastProvider } from '../src/components/ui/toast.js';

function renderPage() {
  return render(
    <ToastProvider>
      <Page />
    </ToastProvider>
  );
}

// Mock fetch for /api/gen
const letters = {
  'funny': 'a','sincere': 'b','shameless': 'c','legal-cold': 'd','silent-treatment': 'e',
};

describe('Landing page', () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { cleanup(); });

  it('shows form, then 5 cards after submit', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ letters, meta: { model: 'workers-ai', latency_ms: 1 } }), {
        status: 200, headers: { 'content-type': 'application/json' },
      })
    );
    renderPage();
    fireEvent.change(screen.getByPlaceholderText(/我做了什么/), { target: { value: '我把室友的猫放跑了' } });
    fireEvent.click(screen.getByRole('button', { name: /生成 5 种风格/ }));
    await waitFor(() => {
      expect(screen.getByText('搞笑')).toBeInTheDocument();
    });
    expect(screen.getByText('已读不回')).toBeInTheDocument();
  });

  it('shows RejectScreen on real-person reject', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'real-person', message: '拒绝' }), {
        status: 422, headers: { 'content-type': 'application/json' },
      })
    );
    renderPage();
    fireEvent.change(screen.getByPlaceholderText(/我做了什么/), { target: { value: '把文本写长一点假装通过校验再触发服务端' } });
    fireEvent.click(screen.getByRole('button', { name: /生成 5 种风格/ }));
    await waitFor(() => {
      expect(screen.getByText(/请求被拒绝/)).toBeInTheDocument();
    });
  });
});
