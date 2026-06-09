'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useUsage } from '@/hooks/useUsage';
import { UsagePanel } from './UsagePanel';
import { saveJSON } from '@/lib/storage';
import type { ModelId } from '@sry/shared';
import type { Settings, Tone } from '@/hooks/useSettings';

const MODEL_LABELS: Record<ModelId, string> = {
  'workers-ai': 'Workers AI (免费,中文风格略弱)',
  'gemini-flash': 'Gemini 2.0 Flash (免费,推荐)',
  'claude-haiku': 'Claude 3.5 Haiku (需 key,质量最好)',
  'deepseek': 'DeepSeek V3 (几乎免费,中文好)',
};

const TONE_OPTIONS: Tone[] = ['搞笑', '真诚', '耍赖', '法务', '已读不回'];
const TONE_LABELS: Record<Tone, string> = {
  '搞笑': '搞笑 😂',
  '真诚': '真诚 🤝',
  '耍赖': '耍赖 🤡',
  '法务': '法务 📜',
  '已读不回': '已读不回 👻',
};

const STORAGE_KEY = 'sry:settings:v2';
const DEFAULT_API_BASE = 'https://sry-worker.491750329.workers.dev';

export function SettingsPage({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (next: Partial<Settings>) => void;
}) {
  const [saved, setSaved] = useState(false);
  const { usage, loading, error, refresh } = useUsage(settings.apiBase);

  function persist(partial: Partial<Settings>) {
    onChange(partial);
    saveJSON(STORAGE_KEY, { ...settings, ...partial });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleClearCache() {
    if (!window.confirm('清除全部 localStorage 数据?这会重置所有设置。')) return;
    window.localStorage.clear();
    window.location.reload();
  }

  function handleReset() {
    if (!window.confirm('重置全部设置到默认?这会删除当前的所有配置,但保留缓存数据。')) return;
    window.localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Top nav bar */}
      <div className="flex items-center justify-between bg-cream border border-[#c9a98d] rounded-md px-4 py-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-seal text-cream rounded-full text-xs font-bold italic">
            S
          </span>
          <h1 className="text-base font-semibold text-ink">嘴笨助手 / 设置</h1>
        </div>
        <Link
          href="/"
          className="bg-[#fdf0e6] text-ink px-3 py-1.5 rounded text-xs border border-[#c9a98d] hover:bg-paper no-underline"
        >
          ← 返回主页
        </Link>
      </div>

      {/* 2x2 grid of cards */}
      <div className="grid grid-cols-2 gap-3" data-settings-grid>

        {/* Card 1: BYOK (top-left) */}
        <div className="bg-cream border border-[#c9a98d] rounded-md p-3.5 flex flex-col">
          <h2 className="text-xs font-semibold text-ink mb-1">🔑 BYOK</h2>
          <p className="text-[10px] text-muted mb-2.5">Key 只在本浏览器 localStorage。</p>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-[10px] text-ink mb-0.5 h-3">模型</label>
              <select
                value={settings.model}
                onChange={(e) => persist({ model: e.target.value as ModelId })}
                className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] h-6.5"
                aria-label="模型"
              >
                {(Object.keys(MODEL_LABELS) as ModelId[]).map((m) => (
                  <option key={m} value={m}>{MODEL_LABELS[m]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-ink mb-0.5 h-3">API Key</label>
              <input
                type="password"
                autoComplete="off"
                defaultValue={settings.apiKey}
                onBlur={(e) => persist({ apiKey: e.target.value })}
                className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] font-mono h-6.5"
                aria-label="API Key"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-[10px] text-ink mb-0.5 h-3">自费日限 (USD)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                defaultValue={settings.userDailyCapUsd}
                onBlur={(e) => persist({ userDailyCapUsd: Number(e.target.value) })}
                className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] h-6.5"
                aria-label="自费日限"
              />
            </div>
            <div>
              <label className="block text-[10px] text-ink mb-0.5 h-3">自费月限 (USD)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                defaultValue={settings.userMonthlyCapUsd}
                onBlur={(e) => persist({ userMonthlyCapUsd: Number(e.target.value) })}
                className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] h-6.5"
                aria-label="自费月限"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-ink mb-0.5 h-3">API 代理 base</label>
            <input
              type="text"
              defaultValue={settings.apiBase}
              onBlur={(e) => persist({ apiBase: e.target.value || DEFAULT_API_BASE })}
              className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[10px] font-mono h-6.5 overflow-hidden text-ellipsis whitespace-nowrap"
              aria-label="API 代理"
            />
          </div>
        </div>

        {/* Card 2: 免费额度 (top-right) */}
        <div className="bg-cream border border-[#c9a98d] rounded-md p-3.5 flex flex-col">
          <h2 className="text-xs font-semibold text-success mb-1">📊 免费额度</h2>
          <p className="text-[10px] text-muted mb-2.5">跨多个项目共享。</p>

          <div className="flex-1 flex flex-col">
            <UsagePanel
              usage={usage}
              loading={loading}
              error={error}
              onRetry={refresh}
            />
          </div>
        </div>

        {/* Card 3: 偏好 (bottom-left) */}
        <div className="bg-cream border border-[#c9a98d] rounded-md p-3.5 flex flex-col">
          <h2 className="text-xs font-semibold text-ink mb-1">⚙ 偏好</h2>
          <p className="text-[10px] text-muted mb-2.5">聊天与动效。</p>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-[10px] text-ink mb-0.5 h-3">默认语气</label>
              <select
                value={settings.defaultTone}
                onChange={(e) => persist({ defaultTone: e.target.value as Tone })}
                className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] h-6.5"
                aria-label="默认语气"
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{TONE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-ink mb-0.5 h-3">动画</label>
              <select
                value={settings.motion}
                onChange={(e) => persist({ motion: e.target.value as 'auto' | 'on' | 'off' })}
                className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] h-6.5"
                aria-label="动画"
              >
                <option value="auto">跟随系统</option>
                <option value="on">始终开启</option>
                <option value="off">始终关闭</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-ink mb-0.5 h-3 opacity-50">暗色模式 (v3 即将到来)</label>
            <div
              className="w-full bg-paper border border-dashed border-[#c9a98d] rounded px-2 py-1 text-[11px] text-muted h-6.5 flex items-center"
              aria-label="暗色模式"
            >
              浅色 (仅持久化)
            </div>
          </div>

          <div className="mt-auto pt-2 border-t border-dashed border-[#c9a98d] text-[10px] text-muted">
            修改即保存 (localStorage)
          </div>
        </div>

        {/* Card 4: 危险区 (bottom-right) */}
        <div className="bg-[#fdf0e6] border border-seal rounded-md p-3.5 flex flex-col">
          <h2 className="text-xs font-semibold text-seal mb-1">⚠ 危险区</h2>
          <p className="text-[10px] text-muted mb-2.5">不可逆操作。</p>

          <button
            type="button"
            onClick={handleClearCache}
            className="w-full bg-white border border-seal text-seal py-1.5 text-[11px] rounded mb-1.5 hover:bg-paper"
          >
            清除全部缓存
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full bg-white border border-seal text-seal py-1.5 text-[11px] rounded mb-2 hover:bg-paper"
          >
            重置全部设置
          </button>

          <div className="mt-auto pt-2 border-t border-dashed border-seal text-[10px] text-muted leading-snug">
            这些操作会:
            <br />
            • 清除 localStorage
            <br />
            • 重载页面
            <br />
            不可撤销
          </div>
        </div>
      </div>

      {saved && (
        <p className="mt-4 text-xs text-success text-center" data-saved="true">
          ✓ 已保存
        </p>
      )}
    </div>
  );
}
