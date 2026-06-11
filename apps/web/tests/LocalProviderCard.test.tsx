import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LocalProviderCard } from '@/components/LocalProviderCard';

describe('<LocalProviderCard />', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders 5 fields (provider, baseUrl, model, apiKey, timeout) + test button', () => {
    render(<LocalProviderCard />);
    expect(screen.getByLabelText(/^provider$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^base url$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^本地模型$/)).toBeInTheDocument();
    expect(screen.getByLabelText(/api key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/timeout/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test/i })).toBeInTheDocument();
  });

  it('loads values from localStorage on mount', () => {
    localStorage.setItem('sry:local:provider', 'ollama');
    localStorage.setItem('sry:local:baseUrl', 'http://localhost:11434');
    localStorage.setItem('sry:local:model', 'llama3.1:8b');
    render(<LocalProviderCard />);
    const providerSel = screen.getByLabelText(/^provider$/i) as HTMLSelectElement;
    expect(providerSel.value).toBe('ollama');
    const urlInput = screen.getByLabelText(/^base url$/i) as HTMLInputElement;
    expect(urlInput.value).toBe('http://localhost:11434');
  });

  it('writes changes to localStorage', () => {
    render(<LocalProviderCard />);
    const modelInput = screen.getByLabelText(/^本地模型$/) as HTMLInputElement;
    fireEvent.change(modelInput, { target: { value: 'qwen2.5-coder:7b' } });
    expect(localStorage.getItem('sry:local:model')).toBe('qwen2.5-coder:7b');
  });

  it('test connection button calls fetch + shows success status', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('OK', { status: 200 }));
    render(<LocalProviderCard />);
    fireEvent.click(screen.getByRole('button', { name: /test/i }));
    await waitFor(() => {
      expect(screen.getByText(/connected|ok|✓/i)).toBeInTheDocument();
    });
    expect(fetchSpy).toHaveBeenCalled();
    // Ollama default → /api/tags
    const url = (fetchSpy.mock.calls[0] as unknown[])[0] as string;
    expect(url).toMatch(/\/api\/tags$/);
  });
});
