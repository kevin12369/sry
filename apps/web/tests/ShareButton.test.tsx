import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShareButton } from '../src/components/ShareButton.js';
import { ToastProvider } from '../src/components/ui/toast.js';

const letters = { 'funny':'a','sincere':'b','shameless':'c','legal-cold':'d','silent-treatment':'e' };

describe('ShareButton', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('writes #share=... to location.hash on click', () => {
    // @ts-expect-error override
    navigator.clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
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
