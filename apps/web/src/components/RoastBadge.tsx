'use client';
import { ROASTS } from '@/data/roasts';
import type { SceneId, StyleId } from '@/data/prompts';

interface Props {
  scene: SceneId;
  style: StyleId;
  className?: string;
}

// LetterCard(LetterPage) 内嵌 1 行 16 字以内的损友点评 badge
// 风格 = 卡片背景上 1 行小字 + 调侃 emoji
// 来源: roasts.ts 5×6
export function RoastBadge({ scene, style, className }: Props) {
  const text = ROASTS[style][scene];
  return (
    <span
      title="AI 损友点评"
      data-roast-badge
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px]',
        'bg-zinc-800/50 text-zinc-300',
        'opacity-60 hover:opacity-100 transition-opacity',
        className ?? '',
      ].filter(Boolean).join(' ')}
    >
      <span aria-hidden="true">🧨</span>
      <span>{text}</span>
    </span>
  );
}