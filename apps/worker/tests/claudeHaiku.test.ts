import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClaudeHaikuClient } from '../src/llm/claudeHaiku.js';

describe('ClaudeHaikuClient', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('posts to Anthropic Messages API and returns first text block', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        content: [{ type: 'text', text: '亲爱的朋友,' }],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    );
    vi.stubGlobal('fetch', fetchMock);
    const c = new ClaudeHaikuClient('sk-test');
    const out = await c.generate({ system: 's', user: 'u' });
    expect(out).toBe('亲爱的朋友,');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect((init as RequestInit).method).toBe('POST');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.model).toBe('claude-3-5-haiku-latest');
    expect(body.messages[0].content).toBe('u');
  });

  it('throws on non-2xx with status text', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('bad', { status: 401 })
    );
    vi.stubGlobal('fetch', fetchMock);
    const c = new ClaudeHaikuClient('sk-test');
    await expect(c.generate({ system: 's', user: 'u' })).rejects.toThrow(/401/);
  });
});
