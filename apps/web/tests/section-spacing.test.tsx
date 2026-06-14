import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Hero } from '@/components/Hero';
import { StatusBadges } from '@/components/StatusBadges';
import { StyleCompare } from '@/components/StyleCompare';
import { FunElements } from '@/components/FunElements';
import { HowItWorks } from '@/components/HowItWorks';
import { WhoIsItFor } from '@/components/WhoIsItFor';
import { RunLocally } from '@/components/RunLocally';
import { FAQ } from '@/components/FAQ';
import { Roadmap } from '@/components/Roadmap';

// PR #2 P1 Fix 2: 9 段统一 py-16 md:py-20(取消 py-12 / py-24 混用)
// FAQ / Roadmap 例外:用 pt-16 md:pt-20 pb-8 + Footer mt-8 拉开视觉层级
describe('section spacing (PR #2 Fix 2)', () => {
  const PY_SECTIONS = [
    { name: 'Hero', Component: Hero },
    { name: 'StatusBadges', Component: StatusBadges },
    { name: 'StyleCompare', Component: StyleCompare },
    { name: 'FunElements', Component: FunElements },
    { name: 'HowItWorks', Component: HowItWorks },
    { name: 'WhoIsItFor', Component: WhoIsItFor },
  ];

  for (const { name, Component } of PY_SECTIONS) {
    it(`${name} uses py-16 md:py-20`, () => {
      const { container } = render(<Component />);
      const section = container.querySelector('section');
      expect(section).not.toBeNull();
      expect(section?.className).toMatch(/\bpy-16\b/);
      expect(section?.className).toMatch(/\bmd:py-20\b/);
    });
  }

  it('RunLocally inner container uses py-16 md:py-20', () => {
    const { container } = render(<RunLocally />);
    const inner = container.querySelector('div.max-w-6xl');
    expect(inner).not.toBeNull();
    expect(inner?.className).toMatch(/\bpy-16\b/);
    expect(inner?.className).toMatch(/\bmd:py-20\b/);
  });

  it('FAQ uses pt-16 md:pt-20 pb-8 mb-8 (Fix 8)', () => {
    const { container } = render(<FAQ />);
    const section = container.querySelector('section');
    expect(section?.className).toMatch(/\bpt-16\b/);
    expect(section?.className).toMatch(/\bmd:pt-20\b/);
    expect(section?.className).toMatch(/\bpb-8\b/);
    expect(section?.className).toMatch(/\bmb-8\b/);
  });

  it('Roadmap uses pt-16 md:pt-20 pb-8 (Fix 8)', () => {
    const { container } = render(<Roadmap />);
    const section = container.querySelector('section');
    expect(section?.className).toMatch(/\bpt-16\b/);
    expect(section?.className).toMatch(/\bmd:pt-20\b/);
    expect(section?.className).toMatch(/\bpb-8\b/);
  });
});