'use client';
import { useEffect, useState } from 'react';
import { DEFAULT_BYOK, loadByok, saveByok, clearByok, type ByokConfig } from '@/lib/byok';
import { Paper } from './Paper';

// 简化 UI: 启用 toggle + 端点 + model + apiKey + 保存 + 清空
export function ByokSettings() {
  const [config, setConfig] = useState<ByokConfig>(DEFAULT_BYOK);
  const [saved, setSaved] = useState<'idle' | 'saved' | 'cleared'>('idle');

  useEffect(() => {
    const loaded = loadByok();
    if (loaded) setConfig(loaded);
  }, []);

  function update<K extends keyof ByokConfig>(k: K, v: ByokConfig[K]) {
    setConfig((c) => ({ ...c, [k]: v }));
  }

  function onSave() {
    saveByok(config);
    setSaved('saved');
    window.setTimeout(() => setSaved('idle'), 1500);
  }

  function onClear() {
    clearByok();
    setConfig(DEFAULT_BYOK);
    setSaved('cleared');
    window.setTimeout(() => setSaved('idle'), 1500);
  }

  return (
    <Paper padding="lg" className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">LLM 设置 (BYOK)</h2>
        <p className="text-xs text-muted mt-1">
          想真玩? 粘贴你的 Ollama / OpenAI 端点, 你的 key 你的配额。默认用预设范文, 不调 LLM。
        </p>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={config.enabled}
          onChange={(e) => update('enabled', e.target.checked)}
          aria-label="启用 LLM"
        />
        <span>启用 LLM (关闭 = 走预设范文)</span>
      </label>
      <div className="space-y-2">
        <label className="block text-sm">
          <span className="text-muted">端点 (baseUrl)</span>
          <input
            type="text"
            value={config.baseUrl}
            onChange={(e) => update('baseUrl', e.target.value)}
            placeholder="http://localhost:11434/v1"
            className="w-full rounded border border-[#c9a98d] bg-cream p-2 text-sm focus:border-seal focus:outline-none mt-1"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Model</span>
          <input
            type="text"
            value={config.model}
            onChange={(e) => update('model', e.target.value)}
            placeholder="llama3.1:8b"
            className="w-full rounded border border-[#c9a98d] bg-cream p-2 text-sm focus:border-seal focus:outline-none mt-1"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">API Key (留空用 Ollama 本地)</span>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => update('apiKey', e.target.value)}
            placeholder="sk-... 或 ollama"
            className="w-full rounded border border-[#c9a98d] bg-cream p-2 text-sm focus:border-seal focus:outline-none mt-1"
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          className="bg-ink text-cream px-4 py-2 rounded hover:bg-dark transition-colors text-sm"
        >
          保存
        </button>
        <button
          type="button"
          onClick={onClear}
          className="border border-[#c9a98d] px-4 py-2 rounded hover:bg-[#f3e9dc] transition-colors text-sm"
        >
          清空
        </button>
        {saved === 'saved' && <span className="text-xs text-muted self-center">已保存</span>}
        {saved === 'cleared' && <span className="text-xs text-muted self-center">已清空</span>}
      </div>
      <p className="text-[10px] text-muted">
        Ollama 本地无 CORS 问题; OpenAI 需用户在浏览器装扩展 (Allow CORS) 或自建反向代理。
        你的 key 只存在浏览器 localStorage, 我们不收集。
      </p>
    </Paper>
  );
}