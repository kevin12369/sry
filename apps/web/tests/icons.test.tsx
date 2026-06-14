import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  FunnyMask,
  SincereHandshake,
  DeflectClown,
  LegalScroll,
  SilentGhost,
  TheaterMasks,
  Dice,
} from '@/components/icons';

// PR #2 P1 + P2: 7 SVG icons 都用 outline 单线 + viewBox=24 + strokeWidth=1.75 + currentColor + fill=none
// 每个 SVG 渲染正常 + viewBox=24 + 1.75 stroke 检查
describe('icons (PR #2)', () => {
  const CASES = [
    { name: 'FunnyMask', Component: FunnyMask },
    { name: 'SincereHandshake', Component: SincereHandshake },
    { name: 'DeflectClown', Component: DeflectClown },
    { name: 'LegalScroll', Component: LegalScroll },
    { name: 'SilentGhost', Component: SilentGhost },
    { name: 'TheaterMasks', Component: TheaterMasks },
    { name: 'Dice', Component: Dice },
  ];

  for (const { name, Component } of CASES) {
    describe(`<${name} />`, () => {
      it('renders without crashing and uses viewBox=24', () => {
        const { container } = render(<Component />);
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      });

      it('uses stroke=currentColor + strokeWidth=1.75 + fill=none (outline 单线规范)', () => {
        const { container } = render(<Component />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('stroke')).toBe('currentColor');
        expect(svg?.getAttribute('stroke-width')).toBe('1.75');
        expect(svg?.getAttribute('fill')).toBe('none');
      });

      it('honors size prop (default 24, override 32)', () => {
        const { container } = render(<Component size={32} />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('32');
        expect(svg?.getAttribute('height')).toBe('32');
      });
    });
  }
});