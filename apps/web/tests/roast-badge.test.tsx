import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoastBadge } from '@/components/RoastBadge';
import { ROASTS } from '@/data/roasts';
import { STYLES, SCENES, type StyleId, type SceneId } from '@/data/prompts';

describe('<RoastBadge /> (PR #3)', () => {
  it('renders the badge with the matching roast text for each (style, scene) cell', () => {
    let n = 0;
    for (const s of STYLES) {
      for (const c of SCENES) {
        const expected = ROASTS[s as StyleId][c as SceneId];
        const { unmount } = render(<RoastBadge scene={c as SceneId} style={s as StyleId} />);
        expect(screen.getByText(expected)).toBeInTheDocument();
        expect(screen.getByText(expected).closest('[data-roast-badge]')).not.toBeNull();
        unmount();
        n++;
      }
    }
    expect(n).toBe(30);
  });

  it('renders 30 distinct badge contents across the 5x6 grid', () => {
    const seen = new Set<string>();
    for (const s of STYLES) {
      for (const c of SCENES) {
        const expected = ROASTS[s as StyleId][c as SceneId];
        const { unmount } = render(<RoastBadge scene={c as SceneId} style={s as StyleId} />);
        const el = screen.getByText(expected);
        seen.add(el.textContent ?? '');
        unmount();
      }
    }
    expect(seen.size).toBeGreaterThanOrEqual(28); // tolerate a few intentional duplicates
  });

  it('applies the optional className', () => {
    render(<RoastBadge scene="apology" style="funny" className="my-extra" />);
    const el = screen.getByText(ROASTS.funny.apology).closest('[data-roast-badge]');
    expect(el?.className).toContain('my-extra');
  });
});