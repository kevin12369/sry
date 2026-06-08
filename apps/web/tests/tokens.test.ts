import { describe, it, expect } from 'vitest';
import { tokens } from '@/lib/tokens';

describe('design tokens', () => {
  it('exposes the paper palette', () => {
    expect(tokens.color.paper).toBe('#f5e8d3');
    expect(tokens.color.cream).toBe('#fdf6ec');
    expect(tokens.color.ink).toBe('#5a3e2b');
    expect(tokens.color.seal).toBe('#c75d4a');
    expect(tokens.color.muted).toBe('#8a7765');
  });

  it('exposes the cjk + latin font stacks', () => {
    expect(tokens.font.cjk).toContain('PingFang SC');
    expect(tokens.font.latin).toContain('system-ui');
  });

  it('exposes the 5-letter style emojis', () => {
    expect(tokens.styleEmoji.funny).toBe('😂');
    expect(tokens.styleEmoji.sincere).toBe('🤝');
    expect(tokens.styleEmoji.shameless).toBe('🤡');
    expect(tokens.styleEmoji['legal-cold']).toBe('📜');
    expect(tokens.styleEmoji['silent-treatment']).toBe('👻');
  });
});
