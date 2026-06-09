import type { LLMClient, GenerateArgs, LLMResult } from './client.js';
import { estimateNeuronsFromUsage } from './neurons.js';

const MODEL = 'gemini-2.0-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export class GeminiFlashClient implements LLMClient {
  readonly id = 'gemini-flash' as const;
  constructor(private readonly apiKey: string) {}

  async generate(args: GenerateArgs): Promise<LLMResult> {
    const body = {
      systemInstruction: { parts: [{ text: args.system }] },
      contents: [{ role: 'user', parts: [{ text: args.user }] }],
      generationConfig: {
        temperature: args.temperature ?? 0.9,
        maxOutputTokens: args.maxTokens ?? 400,
      },
    };
    const res = await fetch(`${ENDPOINT}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: args.signal,
    });
    if (!res.ok) {
      throw new Error(`gemini-http-${res.status}: ${await res.text()}`);
    }
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    };
    const text = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
    const usage = data.usageMetadata ? {
      prompt_tokens: data.usageMetadata.promptTokenCount,
      completion_tokens: data.usageMetadata.candidatesTokenCount,
    } : undefined;
    return { text, neurons: estimateNeuronsFromUsage('gemini-flash', usage) };
  }
}
