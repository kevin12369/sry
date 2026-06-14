'use client';
import { useState } from 'react';
import { SAMPLE_LETTERS } from '@/data/sample-letters';
import { ROASTS } from '@/data/roasts';
import { PROMPTS, STYLES, type StyleId, type SceneId } from '@/data/prompts';
import { COMMON_PREFIX, OUTPUT_FORMAT, SCENE_CONTEXT, STYLE_SYSTEM } from '@/data/system-prompts';
import { callLlm, LlmError } from '@/lib/llm-client';
import { loadByok } from '@/lib/byok';
import type { LetterEntry, LettersSource, SryState } from '@/lib/state-machine';

export interface UseGenerate {
  state: SryState;
  compose: (scene: SceneId, situation: string) => Promise<void>;
  reset: () => void;
}

export function useGenerate(): UseGenerate {
  const [state, setState] = useState<SryState>({ stage: 'idle' });

  async function compose(scene: SceneId, situation: string) {
    setState({ stage: 'composing', scene, spinning: true });

    const byok = loadByok();
    if (byok?.enabled) {
      const letters: LetterEntry[] = [];
      let llmCount = 0;
      let sampleCount = 0;
      for (const s of STYLES) {
        const result = await tryOneStyle(s, scene, situation, byok);
        if (result.used === 'llm') llmCount++;
        else sampleCount++;
        letters.push({ style: s, body: result.body, roast: ROASTS[s][scene] });
      }
      const source: LettersSource = llmCount === 0 ? 'sample' : sampleCount === 0 ? 'llm' : 'mixed';
      setState({ stage: 'ready', scene, letters, source });
      return;
    }

    await new Promise((r) => setTimeout(r, 300));
    const letters: LetterEntry[] = STYLES.map((s: StyleId) => ({
      style: s,
      body: SAMPLE_LETTERS[s],
      roast: ROASTS[s][scene],
    }));
    setState({ stage: 'ready', scene, letters, source: 'sample' });
  }

  function reset() {
    setState({ stage: 'idle' });
  }

  return { state, compose, reset };
}

interface OneResult {
  body: string;
  used: 'llm' | 'sample';
}

async function tryOneStyle(
  style: StyleId,
  scene: SceneId,
  situation: string,
  byok: NonNullable<ReturnType<typeof loadByok>>,
): Promise<OneResult> {
  try {
    const messages = buildMessages(style, scene, situation);
    const content = await callLlm({
      config: {
        baseUrl: byok.baseUrl,
        apiKey: byok.apiKey,
        model: byok.model,
      },
      messages,
      temperature: 0.8,
      maxTokens: 250,
    });
    const trimmed = content.trim();
    if (trimmed.length === 0 && style !== 'silent') {
      return { body: SAMPLE_LETTERS[style], used: 'sample' };
    }
    return { body: trimmed, used: 'llm' };
  } catch (e) {
    if (!(e instanceof LlmError)) {
      // non-LlmError: still fallback
    }
    return { body: SAMPLE_LETTERS[style], used: 'sample' };
  }
}

function buildMessages(style: StyleId, scene: SceneId, situation: string) {
  const system = [
    COMMON_PREFIX,
    STYLE_SYSTEM[style],
    SCENE_CONTEXT[scene],
    `风格 × 场景指令: ${PROMPTS[style][scene]}`,
    OUTPUT_FORMAT,
  ].join('\n');
  const user = `我需要一封信。情境: ${situation}`;
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ];
}