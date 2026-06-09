'use client';
import { useState } from 'react';
import { Drawer } from './ui/drawer.js';
import { UsagePanel } from './UsagePanel.js';
import { useUsage } from '@/hooks/useUsage.js';
import { saveJSON } from '@/lib/storage.js';
import type { ModelId } from '@sry/shared';
import type { Settings, Tone } from '@/hooks/useSettings.js';

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

export function SettingsDrawer({
  open, onClose, settings, onChange,
}: {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onChange: (next: Partial<Settings>) => void;
}) {
  const [saved, setSaved] = useState(false);
  const { usage, loading: usageLoading, error: usageError, refresh } = useUsage(settings.apiBase);

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
    <Drawer open={open} onClose={onClose}>
      {/* Top fixed header */}
      <h2 className="text-lg font-semibold text-ink px-5 pt-5 pb-4 flex-shrink-0">设置</h2>

      {/* Middle: 3 sections that scroll independently when content overflows */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 space-y-5" data-settings-scroll>
        {/* === BYOK === */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-ink">🔑 BYOK</h3>
          <p className="text-xs text-muted">你的 Key 只在本浏览器 localStorage,我们服务端零存储。</p>

          <label className="block text-sm font-medium text-ink">API Key</label>
          <input
            type="password"
            autoComplete="off"
            defaultValue={settings.apiKey}
            onBlur={(e) => persist({ apiKey: e.target.value })}
            className="w-full rounded border border-[#c9a98d] bg-cream focus:border-seal p-2 text-sm"
            aria-label="API Key"
          />

          <label className="block text-sm font-medium text-ink">模型</label>
          <select
            value={settings.model}
            onChange={(e) => persist({ model: e.target.value as ModelId })}
            className="w-full rounded border border-[#c9a98d] bg-cream focus:border-seal p-2 text-sm"
            aria-label="模型"
          >
            {(Object.keys(MODEL_LABELS) as ModelId[]).map((m) => (
              <option key={m} value={m}>{MODEL_LABELS[m]}</option>
            ))}
          </select>

          <label className="block text-sm font-medium text-ink">自费日限 (USD)</label>
          <input
            type="number" min={0} step={0.5}
            defaultValue={settings.userDailyCapUsd}
            onBlur={(e) => persist({ userDailyCapUsd: Number(e.target.value) })}
            className="w-full rounded border border-[#c9a98d] bg-cream focus:border-seal p-2 text-sm"
            aria-label="自费日限"
          />
          <p className="text-xs text-muted">自费硬上限,默认 0 不限。</p>

          <label className="block text-sm font-medium text-ink">自费月限 (USD)</label>
          <input
            type="number" min={0} step={0.5}
            defaultValue={settings.userMonthlyCapUsd}
            onBlur={(e) => persist({ userMonthlyCapUsd: Number(e.target.value) })}
            className="w-full rounded border border-[#c9a98d] bg-cream focus:border-seal p-2 text-sm"
            aria-label="自费月限"
          />

          <label className="block text-sm font-medium text-ink">API 代理 base</label>
          <input
            type="text"
            defaultValue={settings.apiBase}
            onBlur={(e) => persist({ apiBase: e.target.value || 'https://sry-worker.491750329.workers.dev' })}
            className="w-full rounded border border-[#c9a98d] bg-cream focus:border-seal p-2 text-sm font-mono text-xs"
            aria-label="API 代理"
          />
          <p className="text-xs text-muted">默认走官方 Worker,可填自建代理(支持 LLM 兼容的 base URL)。</p>
        </section>

        {/* === 免费额度(只读) === */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-ink">📊 免费额度</h3>
          <UsagePanel usage={usage} loading={usageLoading} error={usageError} onRetry={refresh} />
        </section>

        {/* === 偏好 === */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-ink">⚙ 偏好</h3>

          <label className="block text-sm font-medium text-ink">默认语气</label>
          <select
            value={settings.defaultTone}
            onChange={(e) => persist({ defaultTone: e.target.value as Tone })}
            className="w-full rounded border border-[#c9a98d] bg-cream focus:border-seal p-2 text-sm"
            aria-label="默认语气"
          >
            {TONE_OPTIONS.map((t) => (
              <option key={t} value={t}>{TONE_LABELS[t]}</option>
            ))}
          </select>

          <label className="block text-sm font-medium text-ink">动画</label>
          <select
            value={settings.motion}
            onChange={(e) => persist({ motion: e.target.value as 'auto' | 'on' | 'off' })}
            className="w-full rounded border border-[#c9a98d] bg-cream focus:border-seal p-2 text-sm"
            aria-label="动画"
          >
            <option value="auto">跟随系统</option>
            <option value="on">始终开启</option>
            <option value="off">始终关闭</option>
          </select>

          <label className="block text-sm font-medium text-ink opacity-50">暗色模式 (v3)</label>
          <select
            value={settings.darkMode}
            disabled
            className="w-full rounded border border-[#c9a98d] bg-cream/50 p-2 text-sm cursor-not-allowed"
            aria-label="暗色模式"
          >
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="auto">跟随系统</option>
          </select>
          <p className="text-xs text-muted">v3 即将到来,目前仅持久化。</p>
        </section>
      </div>

      {/* Bottom sticky danger zone — always visible regardless of content length */}
      <div className="flex-shrink-0 border-t border-dashed border-[#c9a98d] bg-[#fdf0e6] px-5 py-4 space-y-2">
        <h3 className="text-sm font-semibold text-seal">⚠ 危险区</h3>
        <button
          type="button"
          onClick={handleClearCache}
          className="w-full text-sm bg-cream border border-seal text-seal px-3 py-2 rounded hover:bg-paper"
        >
          清除全部缓存
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full text-sm bg-cream border border-seal text-seal px-3 py-2 rounded hover:bg-paper"
        >
          重置全部设置
        </button>
      </div>

      {saved && (
        <div
          role="status"
          data-saved="true"
          className="absolute top-16 left-1/2 -translate-x-1/2 text-xs text-success bg-cream border border-success px-3 py-1 rounded shadow-paper"
        >
          ✓ 已保存
        </div>
      )}
    </Drawer>
  );
}
