import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ShareButton } from '../src/components/ShareButton.js';
import { ToastProvider } from '../src/components/ui/toast.js';

const letters = { 'funny':'a','sincere':'b','shameless':'c','legal-cold':'d','silent-treatment':'e' };

describe('ShareButton', () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { cleanup(); });

  it('writes #share=... to location.hash on click', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // navigator.clipboard is a getter in modern environments, so use defineProperty.
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: { writeText },
    });
    const write = vi.spyOn(navigator.clipboard, 'writeText');
    render(
      <ToastProvider>
        <ShareButton letters={letters} situation="x" personality="direct" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /分享/ }));
    expect(window.location.hash.startsWith('#share=')).toBe(true);
    expect(write).toHaveBeenCalled();
  });
});
