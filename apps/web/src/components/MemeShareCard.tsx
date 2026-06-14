'use client';
import { useState } from 'react';
import { Paper } from './Paper';
import { SCENE_EMOJI } from './SceneForm';
import { STYLE_EMOJI, STYLE_NAMES_ZH, SCENE_NAMES_ZH, type SceneId, type StyleId } from '@/data/prompts';
import { buildMemeShareUrl, type MemeSharePayload } from '@/lib/share';

interface Props {
  payload: MemeSharePayload;
  onWriteOwn: () => void;
}

// 分享卡片 UI: 用户情境 + 1 封信 + AI 损友点评 + Sry.lol 品牌
// 截图按钮(用浏览器原生 share sheet 或 fallback 复制链接)
export function MemeShareCard({ payload, onWriteOwn }: Props) {
  const { scene, style, letter, roast, situation } = payload;
  const [copied, setCopied] = useState(false);

  async function shareMeme() {
    const url = buildMemeShareUrl({ scene, style, letter, roast, situation });
    if (typeof navigator !== 'undefined' && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
          title: 'Sry.lol · 我闯的祸',
          text: `${STYLE_EMOJI[style]} ${STYLE_NAMES_ZH[style]} | ${SCENE_NAMES_ZH[scene]} · ${roast}`,
          url,
        });
        return;
      } catch {
        // fall through to copy
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } else {
      window.location.hash = `#meme=${url.split('#meme=')[1] ?? ''}`;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Paper padding="md" className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Sry.lol · 梗图分享</h1>
        <button onClick={onWriteOwn} className="text-sm text-seal hover:underline">
          我也玩一封 →
        </button>
      </Paper>

      <div data-meme-card className="rounded-paper border-2 border-seal bg-cream p-6 space-y-4 shadow-paper">
        <div className="flex items-center gap-2">
          <span
            data-scene-chip
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-paper border border-[#c9a98d] text-xs text-ink"
          >
            <span aria-hidden="true">{SCENE_EMOJI[scene as SceneId]}</span>
            {SCENE_NAMES_ZH[scene as SceneId]}
          </span>
          {situation && (
            <span className="text-xs text-muted truncate">· {situation}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl" aria-hidden="true">{STYLE_EMOJI[style as StyleId]}</span>
          <strong className="text-seal text-lg">{STYLE_NAMES_ZH[style as StyleId]}</strong>
        </div>
        <p className="text-base text-ink whitespace-pre-wrap leading-9">
          {letter || '(这封是空的 —— 真的没回)'}
        </p>
        <div className="border-t border-dashed border-seal pt-3 flex items-center justify-between">
          <span className="text-sm text-seal italic">🧨 {roast}</span>
          <span className="text-[10px] text-muted">Sry.lol</span>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={shareMeme}
          data-share-meme-btn
          className="inline-flex items-center gap-2 px-5 py-2 rounded bg-seal text-cream hover:bg-[#a84938] transition-colors"
        >
          {copied ? '已复制链接' : '🖼️ 分享为梗图'}
        </button>
      </div>
    </div>
  );
}