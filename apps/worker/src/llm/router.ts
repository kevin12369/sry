import type { ModelId } from '@sry/shared';
import type { LLMClient } from './client.js';
import { WorkersAIClient } from './workersAi.js';
import { GeminiFlashClient } from './geminiFlash.js';
import { ClaudeHaikuClient } from './claudeHaiku.js';

export interface PickArgs {
  model: ModelId;
  headers: Headers;
  env: Env;
}

export function pickClient({ model, headers, env }: PickArgs): LLMClient {
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
    case 'ollama':
    case 'openai-compatible': {
      throw new Error('local provider requires local args; pass local to pickClient');
    }
    default: {
      const _exhaustive: never = model;
      throw new Error(`unknown model: ${String(_exhaustive)}`);
    }
  }
}
