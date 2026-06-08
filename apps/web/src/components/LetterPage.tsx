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
  style, body, allLetters, onRetry, onClose,
}: {
  style: Style;
  body: string;
  allLetters: Partial<StyleMap>;
  onRetry: () => void;
  onClose: () => void;
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
    <Paper padding="lg" fold className="max-w-2xl mx-auto relative">
      {/* Stamp */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        <div className="border-2 border-dashed border-ink bg-cream px-3 py-2 text-2xl">
          {emoji}
        </div>
        {/* Postmark */}
        <div className="border border-seal text-seal text-[10px] px-1 rotate-[-8deg]">
          S R Y · 信 寄
        </div>
      </div>
      <div className="pr-24">
        <h2 className="text-2xl font-semibold text-seal italic">{LABELS[style]}</h2>
        <p className="text-xs text-muted mt-1">字数 {body.length}</p>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-base leading-9 text-ink mt-5">
{body}
      </pre>
      <LetterActions
        body={body}
        allLetters={fullLetters}
        onRetry={onRetry}
        onClose={onClose}
      />
    </Paper>
  );
}
