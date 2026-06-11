import type { LLMClient, GenerateArgs, LLMResult } from './client.js';

export class OllamaClient implements LLMClient {
  readonly id = 'ollama' as const;

  constructor(
    private readonly baseUrl: string,
    private readonly model: string,
    private readonly timeoutMs = 30000,
  ) {}

  async generate(args: GenerateArgs): Promise<LLMResult> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/api/generate`;
    const body = {
      model: this.model,
      prompt: `${args.system}\n\n${args.user}`,
      stream: false,
      options: {
        temperature: args.temperature ?? 0.9,
        num_predict: args.maxTokens ?? 400,
      },
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`ollama-http-${res.status}: ${await res.text()}`);
      }
      const json = (await res.json()) as {
        response?: string;
        prompt_eval_count?: number;
        eval_count?: number;
      };
      const text = (json.response ?? '').trim();
      if (!text) throw new Error('ollama: empty response');
      // local provider → neurons coefficient is 0
      return { text, neurons: 0 };
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        throw new Error(`ollama: timeout after ${this.timeoutMs}ms`);
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }
}
