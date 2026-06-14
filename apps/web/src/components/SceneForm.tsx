'use client';
import { useState } from 'react';
import { ChatStep } from './ChatStep';
import { ProgressSeal } from './ProgressSeal';
import { Paper } from './Paper';
import { SCENES, SCENE_NAMES_ZH, STYLES, STYLE_NAMES_ZH, type SceneId, type StyleId } from '@/data/prompts';
import type { Tone } from '@/hooks/useSettings';

export type SceneFormValue = {
  scene: SceneId;
  style: StyleId;
  situation: string;
};

const TONE_TO_STYLE: Record<Tone, StyleId> = {
  '搞笑': 'funny',
  '真诚': 'sincere',
  '耍赖': 'deflect',
  '法务': 'legal',
  '已读不回': 'silent',
};

export function SceneForm({
  onSubmit,
  defaultTone = '真诚',
}: {
  onSubmit: (v: SceneFormValue) => void;
  defaultTone?: Tone;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [scene, setScene] = useState<SceneId | ''>('');
  const [style, setStyle] = useState<StyleId>(TONE_TO_STYLE[defaultTone] ?? 'sincere');
  const [situation, setSituation] = useState('');
  const [err, setErr] = useState<string | null>(null);

  function next() {
    if (step === 1) {
      if (!scene) { setErr('请选一个场景'); return; }
      setErr(null);
      setStep(2);
      return;
    }
    if (step === 2) {
      const trimmed = situation.trim();
      if (trimmed.length < 5) { setErr('至少写 5 个字'); return; }
      if (trimmed.length > 300) { setErr('最多 300 字'); return; }
      setErr(null);
      setStep(3);
      return;
    }
    onSubmit({ scene: scene as SceneId, style, situation });
  }
  function back() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
  }

  return (
    <div className="space-y-5">
      <ProgressSeal current={step} total={3} />
      {step === 1 && (
        <ChatStep step={1} question="今晚要当什么角色?" hint="选个场景(不选?我们 5 种都给你)">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SCENES.map((s) => (
              <Paper
                key={s}
                padding="sm"
                className={`cursor-pointer text-center ${scene === s ? 'border-seal border-2' : ''}`}
              >
                <label className="block">
                  <input
                    type="radio"
                    name="scene"
                    value={s}
                    checked={scene === s}
                    onChange={() => setScene(s)}
                    className="sr-only"
                  />
                  <span className="font-medium">{SCENE_NAMES_ZH[s]}</span>
                </label>
              </Paper>
            ))}
          </div>
          {err && <p className="text-xs text-seal">{err}</p>}
        </ChatStep>
      )}
      {step === 2 && (
        <ChatStep
          step={2}
          question={scene ? `你${SCENE_NAMES_ZH[scene as SceneId]}谁?` : '发生了什么事?'}
          hint="把你做的事说清楚就行,5-300 字"
        >
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={5}
            maxLength={300}
            placeholder="例如: 我把室友的猫放跑了, 他很生气"
            aria-label="情境"
            className="w-full rounded border border-[#c9a98d] bg-cream p-3 text-sm focus:border-seal focus:outline-none"
          />
          <div className="text-xs text-muted flex justify-between">
            <span>{err && <span className="text-seal">{err}</span>}</span>
            <span>{situation.length}/300</span>
          </div>
        </ChatStep>
      )}
      {step === 3 && (
        <ChatStep step={3} question="今晚的人设?" hint="不选? 5 种都给你">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {STYLES.map((s) => (
              <Paper
                key={s}
                padding="sm"
                className={`cursor-pointer text-center ${style === s ? 'border-seal border-2' : ''}`}
              >
                <label className="block">
                  <input
                    type="radio"
                    name="style"
                    value={s}
                    checked={style === s}
                    onChange={() => setStyle(s)}
                    className="sr-only"
                  />
                  <span className="font-medium">{STYLE_NAMES_ZH[s]}</span>
                </label>
              </Paper>
            ))}
          </div>
          {err && <p className="text-xs text-seal">{err}</p>}
        </ChatStep>
      )}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 1}
          className="text-muted disabled:opacity-30 hover:text-ink"
        >
          ← 上一步
        </button>
        <button
          type="button"
          onClick={next}
          className="bg-ink text-cream px-6 py-2 rounded hover:bg-dark transition-colors"
        >
          {step < 3 ? '下一步 →' : '看人设 📮'}
        </button>
      </div>
    </div>
  );
}
