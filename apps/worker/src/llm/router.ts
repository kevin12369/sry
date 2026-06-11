import type { ModelId } from '@sry/shared';
import type { LLMClient } from './client.js';
import { WorkersAIClient } from './workersAi.js';
import { GeminiFlashClient } from './geminiFlash.js';
import { ClaudeHaikuClient } from './claudeHaiku.js';
import { OllamaClient } from './ollama.js';
import { OpenAiCompatibleClient } from './openaiCompatible.js';
import { validateLocalBaseUrl } from './baseUrl.js';

export interface LocalArgs {
  baseUrl: string;
  model: string;
  apiKey?: string;
  timeoutMs?: number;
}

export interface PickArgs {
  model: ModelId;
  headers: Headers;
  env: Env;
  local?: LocalArgs;
}

export function pickClient({ model, headers, env, local }: PickArgs): LLMClient {
  switch (model) {
    case 'workers-ai':
      return new WorkersAIClient(env.AI);
    case 'gemini-flash': {
      const key = headers.get('x-api-key') ?? env.GEMINI_API_KEY;
      if (!key) throw new Error('gemini api key missing');
      return new GeminiFlashClient(key);
    }
    case 'claude-haiku': {
      const key = headers.get('x-api-key') ?? env.ANTHROPIC_API_KEY;
      if (!key) throw new Error('claude api key missing');
      return new ClaudeHaikuClient(key);
    }
    case 'deepseek': {
      // TODO(usage-settings-plan Task 2+): wire DeepSeek client.
      throw new Error('deepseek client not yet wired');
    }
    case 'ollama': {
      if (!local?.baseUrl) throw new Error('local baseUrl required for ollama');
      validateLocalBaseUrl(local.baseUrl);
      return new OllamaClient(
        local.baseUrl,
        local.model ?? 'default',
        local.timeoutMs ?? 30000,
      );
    }
    case 'openai-compatible': {
      if (!local?.baseUrl) throw new Error('local baseUrl required for openai-compatible');
      validateLocalBaseUrl(local.baseUrl);
      return new OpenAiCompatibleClient(
        local.baseUrl,
        local.model ?? 'default',
        local.apiKey,
        local.timeoutMs ?? 30000,
      );
    }
    default: {
      const _exhaustive: never = model;
      throw new Error(`unknown model: ${String(_exhaustive)}`);
    }
  }
}
