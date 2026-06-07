import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiFlashClient } from '../src/llm/geminiFlash.js';

describe('GeminiFlashClient', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('posts to Gemini REST and returns text', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: '真诚的道歉。' }] } }],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    );
    vi.stubGlobal('fetch', fetchMock);
    const c = new GeminiFlashClient('gkey');
    const out = await c.generate({ system: 'sys', user: 'u' });
    expect(out).toBe('真诚的道歉。');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url as string).toContain('generativelanguage.googleapis.com');
    expect(url as string).toContain('gemini-2.0-flash');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.contents[0].parts[0].text).toBe('u');
    expect(body.systemInstruction.parts[0].text).toBe('sys');
  });
});
