'use client';
import { useState } from 'react';
import { SAMPLE_LETTERS } from '@/data/sample-letters';
import { ROASTS } from '@/data/roasts';
import { STYLES, type StyleId, type SceneId } from '@/data/prompts';
import type { LetterEntry, SryState } from '@/lib/state-machine';

export interface UseGenerate {
  state: SryState;
  compose: (scene: SceneId, situation: string) => Promise<void>;
  reset: () => void;
}

export function useGenerate(): UseGenerate {
  const [state, setState] = useState<SryState>({ stage: 'idle' });

  async function compose(scene: SceneId, situation: string) {
    setState({ stage: 'composing', scene, spinning: true });
    // PR #1: 用预设范文代替 LLM 输出(无后端,无网络)
    // PR #2: 替换为浏览器 OAI 兼容 fetch
    await new Promise((r) => setTimeout(r, 300));
    const letters: LetterEntry[] = STYLES.map((s: StyleId) => ({
      style: s,
      body: SAMPLE_LETTERS[s],
      roast: ROASTS[s][scene],
    }));
    setState({ stage: 'ready', scene, letters });
  }

  function reset() {
    setState({ stage: 'idle' });
  }

  return { state, compose, reset };
}
