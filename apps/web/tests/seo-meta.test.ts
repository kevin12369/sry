import { describe, it, expect } from 'vitest';
import * as LayoutModule from '@/app/layout';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

const RootLayout = LayoutModule.default;
const metadata = LayoutModule.metadata;

describe('SEO meta (PR #4)', () => {
  it('exports Next.js metadata with title and description', () => {
    expect(String(metadata.title)).toContain('Sry.lol');
    expect(String(metadata.description)).toContain('嘴替');
  });

  it('metadata includes OG and Twitter', () => {
    const og = metadata.openGraph as { type?: string; siteName?: string } | undefined;
    const tw = metadata.twitter as { card?: string } | undefined;
    expect(og?.type).toBe('website');
    expect(og?.siteName).toBe('Sry.lol');
    expect(tw?.card).toBe('summary_large_image');
  });

  it('metadata includes canonical URL', () => {
    const alt = metadata.alternates as { canonical?: string } | undefined;
    expect(alt?.canonical).toBe('https://sry-web.pages.dev');
  });

  it('layout head contains canonical, JSON-LD, og and twitter meta tags', () => {
    const html = renderToStaticMarkup(
      createElement(RootLayout, { children: createElement('div', null, 'hello') })
    );
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('https://sry-web.pages.dev');
    expect(html).toContain('og:type');
    expect(html).toContain('twitter:card');
    expect(html).toContain('application/ld+json');
    expect(html).toContain('SoftwareApplication');
    expect(html).toContain('嘴替游乐场');
  });

  it('JSON-LD does not include any unescaped HTML (XSS-safe static content)', () => {
    const html = renderToStaticMarkup(
      createElement(RootLayout, { children: createElement('div', null, 'hello') })
    );
    const ldMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
    expect(ldMatch).not.toBeNull();
    const json = ldMatch?.[1] ?? '';
    // 解析必须成功且无 < / > 等未转义字符
    expect(() => JSON.parse(json)).not.toThrow();
    expect(json).not.toMatch(/[<>]/);
  });
});