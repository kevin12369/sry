'use client';
import { Drawer } from './ui/drawer.js';
import type { ModelId, Settings } from '@/hooks/useSettings.js';

const MODEL_LABELS: Record<ModelId, string> = {
  'workers-ai': 'Workers AI (免费,中文风格略弱)',
  'gemini-flash': 'Gemini 2.0 Flash (免费,推荐)',
  'claude-haiku': 'Claude 3.5 Haiku (需 key,质量最好)',
};

export function SettingsDrawer({
  open, onClose, settings, onChange,
}: {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onChange: (next: Partial<Settings>) => void;
}) {
  return (
    <Drawer open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">设置</h2>
      <p className="text-xs text-slate-500 mb-4">你的 Key 只在本浏览器 localStorage,我们服务端零存储。</p>

      <label className="block text-sm font-medium text-slate-700">API Key</label>
      <input
        type="password"
        autoComplete="off"
        defaultValue={settings.apiKey}
        onBlur={(e) => onChange({ apiKey: e.target.value })}
        className="mt-1 w-full rounded border border-slate-300 p-2 text-sm"
        aria-label="API Key"
      />

      <label className="mt-4 block text-sm font-medium text-slate-700">模型</label>
      <select
        value={settings.model}
        onChange={(e) => onChange({ model: e.target.value as ModelId })}
        className="mt-1 w-full rounded border border-slate-300 p-2 text-sm"
        aria-label="模型"
      >
        {(Object.keys(MODEL_LABELS) as ModelId[]).map((m) => (
          <option key={m} value={m}>{MODEL_LABELS[m]}</option>
        ))}
      </select>

      <label className="mt-4 block text-sm font-medium text-slate-700">每日消费上限($)</label>
      <input
        type="number" min={0} step={0.5}
        defaultValue={settings.dailyCap}
        onBlur={(e) => onChange({ dailyCap: Number(e.target.value) })}
        className="mt-1 w-full rounded border border-slate-300 p-2 text-sm"
      />
      <p className="text-xs text-slate-500 mt-1">默认 0 表示不限。</p>
    </Drawer>
  );
}
