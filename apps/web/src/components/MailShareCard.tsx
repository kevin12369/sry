'use client';
import { Paper } from './Paper';
import { tokens } from '@/lib/tokens';
import type { Style, StyleMap } from '@sry/shared';

const LABELS: Record<Style, string> = {
  funny: '搞笑', sincere: '真诚', shameless: '耍赖',
  'legal-cold': '法务冷面', 'silent-treatment': '已读不回',
};

export function MailShareCard({
  letters, situation, personality, onWriteOwn,
}: {
  letters: StyleMap;
  situation: string;
  personality: string;
  onWriteOwn: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Paper padding="md" className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">嘴笨助手 · 分享视图</h1>
        <button
          onClick={onWriteOwn}
          className="text-sm text-seal hover:underline"
        >
          我也写一封 →
        </button>
      </Paper>
      <p className="text-xs text-muted text-center">
        原情境: {situation} · 性格: {personality}
      </p>
      <div className="space-y-3">
        {(Object.keys(letters) as Style[]).map((s) => (
          <Paper key={s} padding="md">
            <div className="flex items-center gap-2 mb-2">
              <span aria-hidden="true">{tokens.styleEmoji[s]}</span>
              <strong className="text-seal">{LABELS[s]}</strong>
            </div>
            <p className="text-sm text-ink whitespace-pre-wrap leading-9">{letters[s]}</p>
          </Paper>
        ))}
      </div>
    </div>
  );
}
