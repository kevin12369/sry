import { Paper } from './Paper';
import { STYLE_EMOJI, STYLE_NAMES_ZH, type StyleId } from '@/data/prompts';

const SNIPPET_LIMIT = 30;

type EnvelopeRowProps = {
  style: StyleId;
  body: string;
  roast: string;
  isOpen: boolean;
  onClick: () => void;
};

export function EnvelopeRow({ style, body, roast, isOpen, onClick }: EnvelopeRowProps) {
  const emoji = STYLE_EMOJI[style];
  const showFull = isOpen || body.length <= SNIPPET_LIMIT;
  const text = showFull ? body : body.slice(0, SNIPPET_LIMIT) + '...';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${STYLE_NAMES_ZH[style]} 风格`}
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
          <span className="font-semibold text-ink">{STYLE_NAMES_ZH[style]}</span>
          <span className="text-[10px] text-seal ml-auto italic">损友: {roast}</span>
        </div>
        <p className="text-sm text-ink leading-relaxed">{text || '(这封是空的)'}</p>
      </Paper>
    </button>
  );
}
