'use client';
import { useState } from 'react';
import { Paper } from './Paper';
import { SealButton } from './SealButton';
import { tokens } from '@/lib/tokens';
import { SCENE_NAMES_ZH, STYLE_EMOJI, STYLE_NAMES_ZH, type SceneId, type StyleId } from '@/data/prompts';
import { buildShareUrl } from '@/lib/share';

export function LetterPage({
  style, body, roast, scene, onClose, onPrev, onNext, currentIndex, totalCount,
}: {
  style: StyleId;
  body: string;
  roast: string;
  scene: SceneId;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}) {
  const emoji = STYLE_EMOJI[style];
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');

  async function copyThis() {
    await navigator.clipboard?.writeText(body);
  }

  async function shareThis() {
    const url = buildShareUrl({ scene, style, letter: body, roast, situation: '' });
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 1500);
    } else {
      window.location.hash = `#share=${url.split('#share=')[1] ?? ''}`;
    }
  }

  return (
    <Paper className="max-w-4xl mx-auto relative overflow-hidden !p-0">
      <div className="h-1.5 bg-gradient-to-r from-[#c9a98d] via-[#d4b896] to-[#c9a98d]" aria-hidden="true" />

      <div className="p-6 sm:p-8">
        <div className="mb-4 pb-3 border-b border-dashed border-[#c9a98d]">
          <div className="text-xl font-semibold text-ink">致 您,</div>
          <div className="text-xs text-muted mt-1">
            <span>{STYLE_NAMES_ZH[style]}</span>版 · {SCENE_NAMES_ZH[scene]} · {body.length} 字
          </div>
        </div>

        <div className="absolute top-12 right-6 sm:right-8 flex flex-col items-end gap-2 pointer-events-none">
          <div className="border-2 border-dashed border-ink bg-cream px-3 py-2 text-2xl" aria-hidden="true">
            {emoji}
          </div>
          <div className="border border-seal text-seal text-[10px] px-1 rotate-[-8deg] inline-block">
            S R Y · 信 寄
          </div>
        </div>

        <div className="pr-24 sm:pr-28">
          <pre className="whitespace-pre-wrap font-sans text-base leading-9 text-ink">
{body || '(这封是空的 —— 真的没回)'}
          </pre>
        </div>

        <div className="mt-4 p-3 border border-seal border-dashed rounded bg-[#fdf0e6]">
          <div className="text-[10px] text-seal uppercase tracking-wide">损友点评</div>
          <div className="text-sm text-ink mt-1" data-roast>{roast}</div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#d4b896] flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onPrev}
            className="text-sm bg-cream border border-[#c9a98d] text-ink px-3 py-1.5 rounded hover:bg-paper"
          >
            ← 上一封
          </button>
          <span className="text-xs text-muted flex-1 text-center" data-progress>
            {currentIndex} / {totalCount}
          </span>
          <button
            type="button"
            onClick={onNext}
            className="text-sm bg-cream border border-[#c9a98d] text-ink px-3 py-1.5 rounded hover:bg-paper"
          >
            下一封 →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-xs text-muted hover:text-ink self-center"
          >
            返回信堆
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-3 border-t border-dashed border-[#c9a98d]">
          <SealButton onClick={copyThis}>复制这封</SealButton>
          <SealButton variant="ghost" onClick={shareThis}>
            {shareState === 'copied' ? '已复制链接' : '🔗 分享这封'}
          </SealButton>
          <button
            onClick={onClose}
            className="ml-auto text-sm text-muted hover:text-ink self-center"
          >
            ← 返回
          </button>
        </div>
      </div>
    </Paper>
  );
}
