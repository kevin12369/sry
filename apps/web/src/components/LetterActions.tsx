'use client';
import { SealButton } from './SealButton';
import type { StyleMap } from '@sry/shared';

const LABELS: Record<string, string> = {
  funny: '搞笑', sincere: '真诚', shameless: '耍赖',
  'legal-cold': '法务冷面', 'silent-treatment': '已读不回',
};

type Props = {
  body: string;
  allLetters: StyleMap;
  onRetry: () => void;
  onClose: () => void;
};

export function LetterActions({ body, allLetters, onRetry, onClose }: Props) {
  async function copyThis() {
    await navigator.clipboard?.writeText(body);
  }
  async function copyAll() {
    const text = (Object.keys(allLetters) as (keyof StyleMap)[])
      .map((k) => `【${LABELS[k] ?? k}】\n${(allLetters as StyleMap)[k]}`)
      .join('\n\n');
    await navigator.clipboard?.writeText(text);
  }
  return (
    <div className="flex flex-wrap gap-2 pt-3 border-t border-dashed border-[#c9a98d]">
      <SealButton onClick={copyThis}>复制这封</SealButton>
      <SealButton variant="ghost" onClick={copyAll}>📑 复制全部 5 封</SealButton>
      <SealButton variant="ghost" onClick={onRetry}>↻ 换一版</SealButton>
      <button
        onClick={onClose}
        className="ml-auto text-sm text-muted hover:text-ink self-center"
      >
        ← 返回
      </button>
    </div>
  );
}
