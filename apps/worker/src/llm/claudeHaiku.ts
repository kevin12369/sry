import type { LLMClient, GenerateArgs } from './client.js';

const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-5-haiku-latest';

export class ClaudeHaikuClient implements LLMClient {
  readonly id = 'claude-haiku' as const;
  constructor(private readonly apiKey: string) {}

  async generate(args: GenerateArgs): Promise<string> {
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
    const json = (await res.json()) as { content: Array<{ type: string; text?: string }> };
    const first = json.content.find((b) => b.type === 'text');
    return (first?.text ?? '').trim();
  }
}
