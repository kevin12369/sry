'use client';
import { Paper } from './Paper';
import { tokens } from '@/lib/tokens';
import type { Style } from '@sry/shared';

type EnvelopeProps = {
  style: Style;
  body: string;
  index: number;
  expanded: boolean;
  onClick: () => void;
};

const STYLE_LABELS: Record<Style, string> = {
  funny: '搞笑',
  sincere: '真诚',
  shameless: '耍赖',
  'legal-cold': '法务冷面',
  'silent-treatment': '已读不回',
};

export function Envelope({ style, body, index, expanded, onClick }: EnvelopeProps) {
  const emoji = tokens.styleEmoji[style];
  const snippet = body.slice(0, 30);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${STYLE_LABELS[style]} ${style} 风格`}
      className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-seal rounded-paper"
      style={{
        transform: expanded ? 'rotate(0deg) translateY(0)' : `rotate(${(index - 2) * 1.5}deg) translateY(${index * 4}px)`,
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: expanded ? 50 : index,
      }}
    >
      <Paper padding="md" fold className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{emoji}</span>
          <span className="font-semibold text-ink">{STYLE_LABELS[style]}</span>
          {expanded && <span className="text-xs text-muted ml-auto">字数 {body.length}</span>}
        </div>
        <p className={`text-sm text-ink leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {expanded ? body : snippet}{!expanded && body.length > 30 && '…'}
        </p>
      </Paper>
    </button>
  );
}
