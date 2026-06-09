import { Paper } from './Paper';
import { tokens } from '@/lib/tokens';
import type { Style } from '@sry/shared';

const STYLE_LABELS: Record<Style, string> = {
  funny: '搞笑',
  sincere: '真诚',
  shameless: '耍赖',
  'legal-cold': '法务冷面',
  'silent-treatment': '已读不回',
};

const SNIPPET_LIMIT = 30;

type EnvelopeRowProps = {
  style: Style;
  body: string;
  isOpen: boolean;
  onClick: () => void;
};

export function EnvelopeRow({ style, body, isOpen, onClick }: EnvelopeRowProps) {
  const emoji = tokens.styleEmoji[style];
  const showFull = isOpen || body.length <= SNIPPET_LIMIT;
  const text = showFull ? body : body.slice(0, SNIPPET_LIMIT) + '...';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${STYLE_LABELS[style]} ${style} 风格`}
      aria-pressed={isOpen}
      className={`block w-full text-left rounded-paper border transition-colors ${
        isOpen
          ? 'border-2 border-seal bg-cream'
          : 'border border-[#d4b896] bg-cream hover:bg-paper'
      }`}
    >
      <Paper padding="md" className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{emoji}</span>
          <span className="font-semibold text-ink">{STYLE_LABELS[style]}</span>
          {isOpen && (
            <span className="text-xs text-muted ml-auto">字数 {body.length}</span>
          )}
        </div>
        <p className="text-sm text-ink leading-relaxed">{text}</p>
      </Paper>
    </button>
  );
}
