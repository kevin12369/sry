import { describe, it, expect, vi } from 'vitest';
import { pickClient } from '../src/llm/router.js';

describe('pickClient', () => {
  it('returns WorkersAIClient for workers-ai', () => {
    const c = pickClient({
      model: 'workers-ai',
      headers: new Headers(),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai' },
    });
    expect(c.id).toBe('workers-ai');
  });

  it('returns GeminiFlashClient for gemini-flash (server key)', () => {
    const c = pickClient({
      model: 'gemini-flash',
      headers: new Headers(),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai', GEMINI_API_KEY: 'srvkey' },
    });
    expect(c.id).toBe('gemini-flash');
  });

  it('returns ClaudeHaikuClient for claude-haiku (BYOK header takes precedence)', () => {
    const c = pickClient({
      model: 'claude-haiku',
      headers: new Headers({ 'x-api-key': 'userkey' }),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai' },
    });
    expect(c.id).toBe('claude-haiku');
  });

  it('throws when BYOK selected but no header and no env key', () => {
    expect(() => pickClient({
      model: 'claude-haiku',
      headers: new Headers(),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai' },
    })).toThrow(/api key/);
  });
});

// suppress unused
void vi;
