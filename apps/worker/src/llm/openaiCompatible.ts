import type { LLMClient, GenerateArgs, LLMResult } from './client.js';

export class OpenAiCompatibleClient implements LLMClient {
  readonly id = 'openai-compatible' as const;

  constructor(
    private readonly baseUrl: string,
    private readonly model: string,
    private readonly apiKey?: string,
    private readonly timeoutMs = 30000,
  ) {}

  async generate(args: GenerateArgs): Promise<LLMResult> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/chat/completions`;
    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: args.system },
        { role: 'user', content: args.user },
      ],
      max_tokens: args.maxTokens ?? 400,
      temperature: args.temperature ?? 0.9,
    };
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`openai-compatible-http-${res.status}: ${await res.text()}`);
      }
      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      const text = (json.choices?.[0]?.message?.content ?? '').trim();
      if (!text) throw new Error('openai-compatible: empty response');
      return { text, neurons: 0 };
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        throw new Error(`openai-compatible: timeout after ${this.timeoutMs}ms`);
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }
}
