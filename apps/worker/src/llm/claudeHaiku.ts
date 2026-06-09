import type { LLMClient, GenerateArgs, LLMResult } from './client.js';
import { estimateNeuronsFromUsage } from './neurons.js';

const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-5-haiku-latest';

export class ClaudeHaikuClient implements LLMClient {
  readonly id = 'claude-haiku' as const;
  constructor(private readonly apiKey: string) {}

  async generate(args: GenerateArgs): Promise<LLMResult> {
    const body = {
      model: MODEL,
      max_tokens: args.maxTokens ?? 400,
      temperature: args.temperature ?? 0.9,
      system: args.system,
      messages: [{ role: 'user', content: args.user }],
    };
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
      signal: args.signal,
    });
    if (!res.ok) {
      throw new Error(`claude-http-${res.status}: ${await res.text()}`);
    }
    const data = (await res.json()) as {
      content?: Array<{ type?: string; text?: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
    };
    const first = data.content?.find((b) => b.type === 'text');
    const text = (first?.text ?? '').trim();
    const usage = data.usage ? {
      prompt_tokens: data.usage.input_tokens,
      completion_tokens: data.usage.output_tokens,
    } : undefined;
    return { text, neurons: estimateNeuronsFromUsage('claude-haiku', usage) };
  }
}
