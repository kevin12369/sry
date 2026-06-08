import type { LLMClient, GenerateArgs } from './client.js';

const MODEL = '@cf/meta/llama-3.1-8b-instruct';

export class WorkersAIClient implements LLMClient {
  readonly id = 'workers-ai' as const;
  constructor(private readonly ai: Ai) {}

  async generate(args: GenerateArgs): Promise<string> {
    // Cast MODEL through `as any` for `ai.run`: the 4.20240620 workers-types
    // package mis-categorises @cf/meta/llama-3.1-8b-instruct under
    // BaseAiImageToTextModels. The runtime call is correct; only the type
    // overload is stale. Bump @cloudflare/workers-types to remove the cast.
    const res = await (this.ai as unknown as { run: (m: string, p: unknown) => Promise<unknown> }).run(
      MODEL,
      {
        messages: [
          { role: 'system', content: args.system },
          { role: 'user', content: args.user },
        ],
        max_tokens: args.maxTokens ?? 400,
        temperature: args.temperature ?? 0.9,
      },
    );
    const r = res as { response?: string };
    return (r.response ?? '').trim();
  }
}
