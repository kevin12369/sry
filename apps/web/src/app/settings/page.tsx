'use client';
import { useSettings, type Settings as S, type Tone } from '@/hooks/useSettings';
import { STYLES, STYLE_NAMES_ZH, SCENES, SCENE_NAMES_ZH } from '@/data/prompts';
import { saveJSON } from '@/lib/storage';
import Link from 'next/link';
import { useState } from 'react';

const TONE_OPTIONS: Tone[] = ['搞笑', '真诚', '耍赖', '法务', '已读不回'];

const KEY = 'sry:settings:v2';

export default function SettingsRoute() {
  const [settings, setSettings] = useSettings();
  const [saved, setSaved] = useState(false);

  function persist(partial: Partial<S>) {
    setSettings(partial);
    const cur = (typeof localStorage !== 'undefined' && localStorage.getItem(KEY))
      ? JSON.parse(localStorage.getItem(KEY) as string) as S
      : settings;
    saveJSON(KEY, { ...cur, ...partial });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleReset() {
    if (typeof window === 'undefined') return;
    if (!window.confirm('重置全部设置到默认?')) return;
    window.localStorage.removeItem(KEY);
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-paper py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between bg-cream border border-[#c9a98d] rounded-md px-4 py-2.5 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-seal text-cream rounded-full text-xs font-bold italic">S</span>
            <h1 className="text-base font-semibold text-ink">Sry.lol / 设置</h1>
          </div>
          <Link href="/" className="bg-[#fdf0e6] text-ink px-3 py-1.5 rounded text-xs border border-[#c9a98d] hover:bg-paper no-underline">
            ← 返回主页
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-settings-grid>
          <section className="bg-cream border border-[#c9a98d] rounded-md p-3.5">
            <h2 className="text-xs font-semibold text-ink mb-1">默认语气</h2>
            <p className="text-[10px] text-muted mb-2.5">第 3 步预选哪个人设。</p>
            <select
              value={settings.defaultTone}
              onChange={(e) => persist({ defaultTone: e.target.value as Tone })}
              className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[12px] h-7"
              aria-label="默认语气"
            >
              {TONE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <p className="text-[10px] text-muted mt-2">
              5 种人设:{STYLES.map((s) => STYLE_NAMES_ZH[s]).join(' / ')}
            </p>
            <p className="text-[10px] text-muted mt-1">
              6 种场景:{SCENES.map((s) => SCENE_NAMES_ZH[s]).join(' / ')}
            </p>
          </section>

          <section className="bg-cream border border-[#c9a98d] rounded-md p-3.5">
            <h2 className="text-xs font-semibold text-ink mb-1">动画</h2>
            <p className="text-[10px] text-muted mb-2.5">系统 / 始终开 / 始终关。</p>
            <select
              value={settings.motion}
              onChange={(e) => persist({ motion: e.target.value as 'auto' | 'on' | 'off' })}
              className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[12px] h-7"
              aria-label="动画"
            >
              <option value="auto">跟随系统</option>
              <option value="on">始终开启</option>
              <option value="off">始终关闭</option>
            </select>
          </section>
        </div>

        <section className="mt-3 bg-[#fdf0e6] border border-seal rounded-md p-3.5">
          <h2 className="text-xs font-semibold text-seal mb-1">PR 路线图</h2>
          <ul className="text-[11px] text-ink space-y-1">
            <li>✓ PR #1:5 封预设范文兜底(本页所在状态)</li>
            <li>→ PR #2:浏览器 OAI 兼容 LLM 接入(粘贴 key)</li>
            <li>→ PR #3:SPIN 转盘 + AI 损友扩列 + 已读不回动画</li>
            <li>→ PR #4:8 段宣传页 v2 模板</li>
          </ul>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 w-full bg-white border border-seal text-seal py-1.5 text-[11px] rounded hover:bg-paper"
          >
            重置全部设置
          </button>
        </section>

        {saved && <p className="mt-4 text-xs text-success text-center" data-saved="true">已保存</p>}
      </div>
    </main>
  );
}
