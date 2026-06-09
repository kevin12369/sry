import type { LLMClient, GenerateArgs, LLMResult } from '../llm/client.js';
import { STYLES, type Style, type StyleMap, type Personality } from '@sry/shared';
import { getStylePrompt, renderUserPrompt } from '../prompts/index.js';

export interface RouteArgs {
  situation: string;
  personality: Personality;
  llm: LLMClient;
  timeoutMs?: number;
}

export interface RouteResult {
  letters: StyleMap;
  neurons: number;
}

const PER_STYLE_TIMEOUT_MS = 8000;

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let t: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, rej) => {
    t = setTimeout(() => rej(new Error('timeout')), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    if (t) clearTimeout(t);
  }
}

export async function routeOnce({ situation, personality, llm, timeoutMs = PER_STYLE_TIMEOUT_MS }: RouteArgs): Promise<RouteResult> {
  let totalNeurons = 0;
  const tasks = STYLES.map(async (style: Style): Promise<[Style, string, number]> => {
    const sp = getStylePrompt(style);
    const args: GenerateArgs = {
      system: sp.system,
      user: renderUserPrompt(sp, { situation, personality }),
      maxTokens: 400,
      temperature: 0.9,
    };
    try {
      const out: LLMResult = await withTimeout(llm.generate(args), timeoutMs);
      return [style, out.text, out.neurons];
    } catch {
      // Per spec section 4.3: failure surfaces as "该风格卡片显示'生成失败,点这里换一种说法'按钮"
      // → return empty string so LetterCard's empty-body state renders the retry button.
      // The kill-switch FALLBACK_LETTERS are only used at the Worker /api/gen entry (Task 26),
      // not per-style here.
      return [style, '', 0];
    }
  });

  const settled = await Promise.allSettled(tasks);
  const out = {} as StyleMap;
  for (const r of settled) {
    if (r.status === 'fulfilled') {
      out[r.value[0]] = r.value[1];
      totalNeurons += r.value[2];
    }
  }
  for (const s of STYLES) {
    if (!(s in out)) out[s] = '';
  }
  return { letters: out, neurons: totalNeurons };
}
