'use client';
import { Paper } from './Paper';
import { LetterActions } from './LetterActions';
import { tokens } from '@/lib/tokens';
import type { Style, StyleMap } from '@sry/shared';

const LABELS: Record<Style, string> = {
  funny: '搞笑', sincere: '真诚', shameless: '耍赖',
  'legal-cold': '法务冷面', 'silent-treatment': '已读不回',
};

export function LetterPage({
  style, body, allLetters, onRetry, onClose, onPrev, onNext, currentIndex, totalCount,
}: {
  style: Style;
  body: string;
  allLetters: Partial<StyleMap>;
  onRetry: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}) {
  const emoji = tokens.styleEmoji[style];
  // LetterActions.copyAll needs all 5 entries; fill missing with empty strings.
  const fullLetters: StyleMap = {
    funny: allLetters.funny ?? '',
    sincere: allLetters.sincere ?? '',
    shameless: allLetters.shameless ?? '',
    'legal-cold': allLetters['legal-cold'] ?? '',
    'silent-treatment': allLetters['silent-treatment'] ?? '',
  };
  return (
    <Paper className="max-w-2xl mx-auto relative overflow-hidden !p-0">
      {/* Top decorative bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#c9a98d] via-[#d4b896] to-[#c9a98d]" aria-hidden="true" />

      <div className="p-6 sm:p-8">
        {/* Header: greeting + style label */}
        <div className="mb-4 pb-3 border-b border-dashed border-[#c9a98d]">
          <div className="text-xl font-semibold text-ink">致 您,</div>
          <div className="text-xs text-muted mt-1">
            <span>{LABELS[style]}</span>版 · {body.length} 字
          </div>
        </div>

        {/* Stamp + postmark (right side) */}
        <div className="absolute top-12 right-6 sm:right-8 flex flex-col items-end gap-2 pointer-events-none">
          <div className="border-2 border-dashed border-ink bg-cream px-3 py-2 text-2xl" aria-hidden="true">
            {emoji}
          </div>
          <div className="border border-seal text-seal text-[10px] px-1 rotate-[-8deg] inline-block">
            S R Y · 信 寄
          </div>
        </div>

        {/* Body — extra right padding so body doesn't run under stamp */}
        <div className="pr-24 sm:pr-28">
          <pre className="whitespace-pre-wrap font-sans text-base leading-9 text-ink">
{body}
          </pre>
        </div>

        {/* 3-button navigation row */}
        <div className="mt-6 pt-4 border-t border-[#d4b896] flex items-center gap-2">
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

        <LetterActions
          body={body}
          allLetters={fullLetters}
          onRetry={onRetry}
          onClose={onClose}
        />
      </div>
    </Paper>
  );
}
