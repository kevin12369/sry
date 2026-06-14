'use client';
import { Paper } from './Paper';
import { STYLE_EMOJI, STYLE_NAMES_ZH, SCENE_NAMES_ZH, type SceneId, type StyleId } from '@/data/prompts';
import type { SharePayload } from '@/lib/share';

export function MailShareCard({
  payload, onWriteOwn,
}: {
  payload: SharePayload;
  onWriteOwn: () => void;
}) {
  const { scene, style, letter, roast, situation } = payload;
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Paper padding="md" className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Sry.lol · 分享视图</h1>
        <button
          onClick={onWriteOwn}
          className="text-sm text-seal hover:underline"
        >
          我也玩一封 →
        </button>
      </Paper>
      <p className="text-xs text-muted text-center">
        场景: {SCENE_NAMES_ZH[scene]}{situation ? ` · ${situation}` : ''}
      </p>
      <Paper padding="lg" className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{STYLE_EMOJI[style as StyleId]}</span>
          <strong className="text-seal">{STYLE_NAMES_ZH[style as StyleId]}</strong>
          <span className="text-[10px] text-seal ml-auto italic">损友: {roast}</span>
        </div>
        <p className="text-base text-ink whitespace-pre-wrap leading-9">
          {letter || '(这封是空的 —— 真的没回)'}
        </p>
      </Paper>
    </div>
  );
}
