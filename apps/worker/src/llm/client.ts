import type { ModelId } from '@sry/shared';

export interface GenerateArgs {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
}

export interface LLMClient {
  readonly id: ModelId;
  generate(args: GenerateArgs): Promise<string>;
}
