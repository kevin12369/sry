import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChatStep } from '@/components/ChatStep';

// PR #2 P1 Fix 1: 主表单步骤 1/2/3 数字徽章锁 w-10 h-10 (40px) 圆形 + 数字居中
describe('<ChatStep /> step badge (PR #2 Fix 1)', () => {
  for (const step of [1, 2, 3] as const) {
    it(`step ${step} badge uses w-10 h-10 circle + centered number`, () => {
      const { container } = render(
        <ChatStep step={step} question="Q?" hint="hint">
          <div data-testid="child" />
        </ChatStep>,
      );
      const badge = container.querySelector(`[data-step-badge="${step}"]`);
      expect(badge).not.toBeNull();
      expect(badge?.className).toMatch(/\bw-10\b/);
      expect(badge?.className).toMatch(/\bh-10\b/);
      expect(badge?.className).toMatch(/\brounded-full\b/);
      expect(badge?.className).toMatch(/\bflex\b/);
      expect(badge?.className).toMatch(/\bitems-center\b/);
      expect(badge?.className).toMatch(/\bjustify-center\b/);
      expect(badge?.className).toMatch(/\btext-lg\b/);
      expect(badge?.className).toMatch(/\bfont-semibold\b/);
      expect(badge?.textContent).toBe(String(step));
    });
  }
});