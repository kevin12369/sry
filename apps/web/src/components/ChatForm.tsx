'use client';
import { useState } from 'react';
import type { Personality } from '@sry/shared';
import { ChatStep } from './ChatStep';
import { ProgressSeal } from './ProgressSeal';
import { Paper } from './Paper';
import { validateStep, mapToPersonality, type Audience, type Goal, type Tone } from '@/lib/mapping';

export type ChatFormValue = {
  situation: string;
  audience: Audience;
  goal: Goal;
  tone: Tone;
  personality: Personality;
};

export function ChatForm({ onSubmit }: { onSubmit: (v: ChatFormValue) => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [situation, setSituation] = useState('');
  const [audience, setAudience] = useState<Audience | ''>('');
  const [goal, setGoal] = useState<Goal | ''>('');
  const [tone, setTone] = useState<Tone | ''>('');
  const [err, setErr] = useState<string | null>(null);

  function next() {
    const value = step === 1 ? situation
      : step === 2 ? audience
      : step === 3 ? goal
      : tone;
    const v = validateStep(step, value);
    if (!v.ok) {
      setErr(v.reason === 'too-short' ? '至少写 5 个字' :
             v.reason === 'too-long'  ? '最多 300 字' :
             '请选一项');
      return;
    }
    setErr(null);
    if (step < 4) setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
    else {
      const personality = mapToPersonality(audience as Audience, goal as Goal, tone as Tone);
      onSubmit({ situation, audience: audience as Audience, goal: goal as Goal, tone: tone as Tone, personality });
    }
  }
  function back() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  }

  return (
    <div className="space-y-5">
      <ProgressSeal current={step} total={4} />
      {step === 1 && (
        <ChatStep step={1} question="发生了什么?" hint="把你做的事说清楚就行,5-300 字">
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
      {step === 2 && (
        <ChatStep step={2} question="对方是谁?">
          <div className="grid grid-cols-3 gap-3">
            {(['朋友', '同事', '家人'] as const).map((a) => (
              <Paper key={a} padding="sm" className={`cursor-pointer text-center ${audience === a ? 'border-seal border-2' : ''}`}>
                <label className="block">
                  <input type="radio" name="audience" value={a} checked={audience === a} onChange={() => setAudience(a)} className="sr-only" />
                  <span className="font-medium">{a}</span>
                </label>
              </Paper>
            ))}
          </div>
          {err && <p className="text-xs text-seal">{err}</p>}
        </ChatStep>
      )}
      {step === 3 && (
        <ChatStep step={3} question="你希望达到什么?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['真诚道歉', '给个台阶', '解释清楚'] as const).map((g) => (
              <Paper key={g} padding="sm" className={`cursor-pointer text-center ${goal === g ? 'border-seal border-2' : ''}`}>
                <label className="block">
                  <input type="radio" name="goal" value={g} checked={goal === g} onChange={() => setGoal(g)} className="sr-only" />
                  <span className="font-medium">{g}</span>
                </label>
              </Paper>
            ))}
          </div>
          {err && <p className="text-xs text-seal">{err}</p>}
        </ChatStep>
      )}
      {step === 4 && (
        <ChatStep step={4} question="语气倾向?" hint="不选? 我们 5 种都给你">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(['搞笑', '真诚', '耍赖', '法务', '已读不回'] as const).map((t) => (
              <Paper key={t} padding="sm" className={`cursor-pointer text-center ${tone === t ? 'border-seal border-2' : ''}`}>
                <label className="block">
                  <input type="radio" name="tone" value={t} checked={tone === t} onChange={() => setTone(t)} className="sr-only" />
                  <span className="font-medium">{t}</span>
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
          {step < 4 ? '下一步 →' : '寄出 📮'}
        </button>
      </div>
    </div>
  );
}
