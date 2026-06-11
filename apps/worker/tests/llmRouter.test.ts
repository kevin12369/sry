import { describe, it, expect, vi } from 'vitest';
import { pickClient } from '../src/llm/router.js';

describe('pickClient', () => {
  it('returns WorkersAIClient for workers-ai', () => {
    const c = pickClient({
      model: 'workers-ai',
      headers: new Headers(),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai', PROJECT_DAILY_NEURONS_CAP: '8000', PROJECT_MONTHLY_NEURONS_CAP: '240000' },
    });
    expect(c.id).toBe('workers-ai');
  });

  it('returns GeminiFlashClient for gemini-flash (server key)', () => {
    const c = pickClient({
      model: 'gemini-flash',
      headers: new Headers(),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai', GEMINI_API_KEY: 'srvkey', PROJECT_DAILY_NEURONS_CAP: '8000', PROJECT_MONTHLY_NEURONS_CAP: '240000' },
    });
    expect(c.id).toBe('gemini-flash');
  });

  it('returns ClaudeHaikuClient for claude-haiku (BYOK header takes precedence)', () => {
    const c = pickClient({
      model: 'claude-haiku',
      headers: new Headers({ 'x-api-key': 'userkey' }),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai', PROJECT_DAILY_NEURONS_CAP: '8000', PROJECT_MONTHLY_NEURONS_CAP: '240000' },
    });
    expect(c.id).toBe('claude-haiku');
  });

  it('throws when BYOK selected but no header and no env key', () => {
    expect(() => pickClient({
      model: 'claude-haiku',
      headers: new Headers(),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai', PROJECT_DAILY_NEURONS_CAP: '8000', PROJECT_MONTHLY_NEURONS_CAP: '240000' },
    })).toThrow(/api key/);
  });

  it('returns OllamaClient for ollama when local baseUrl provided', () => {
    const c = pickClient({
      model: 'ollama',
      headers: new Headers(),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai', PROJECT_DAILY_NEURONS_CAP: '8000', PROJECT_MONTHLY_NEURONS_CAP: '240000' },
      local: { baseUrl: 'http://localhost:11434', model: 'llama3.1:8b' },
    });
    expect(c.id).toBe('ollama');
  });

  it('returns OpenAiCompatibleClient for openai-compatible with apiKey', () => {
    const c = pickClient({
      model: 'openai-compatible',
      headers: new Headers(),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai', PROJECT_DAILY_NEURONS_CAP: '8000', PROJECT_MONTHLY_NEURONS_CAP: '240000' },
      local: { baseUrl: 'http://localhost:1234/v1', model: 'qwen2.5-coder-7b', apiKey: 'lm-studio' },
    });
    expect(c.id).toBe('openai-compatible');
  });

  it('throws when local provider selected but no local.baseUrl', () => {
    expect(() => pickClient({
      model: 'ollama',
      headers: new Headers(),
      env: { AI: {} as Ai, RL: {} as KVNamespace, LLM_KILL_SWITCH: 'false', DEFAULT_MODEL: 'workers-ai', PROJECT_DAILY_NEURONS_CAP: '8000', PROJECT_MONTHLY_NEURONS_CAP: '240000' },
    })).toThrow(/baseUrl/);
  });
});

// suppress unused
void vi;
