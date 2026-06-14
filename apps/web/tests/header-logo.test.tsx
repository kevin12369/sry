import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HandwrittenLogo } from '@/components/HandwrittenLogo';

// PR #2 P1 Fix 5: Header 'S' logo 从 w-8 h-8 (36) 降到 w-7 h-7 (28),与正文 md=24 视觉同级
describe('<HandwrittenLogo /> header logo (PR #2 Fix 5)', () => {
  it('logo svg uses w-7 h-7 (28px) box', () => {
    const { container } = render(<HandwrittenLogo />);
    const logo = container.querySelector('[data-header-logo]');
    expect(logo).not.toBeNull();
    expect(logo?.className).toMatch(/\bw-7\b/);
    expect(logo?.className).toMatch(/\bh-7\b/);
    expect(logo?.getAttribute('width')).toBe('28');
    expect(logo?.getAttribute('height')).toBe('28');
  });
});