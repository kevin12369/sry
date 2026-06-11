'use client';
import { useEffect, useState } from 'react';

const PROVIDERS = [
  { id: 'ollama', label: 'Ollama' },
  { id: 'openai-compatible', label: 'OpenAI 兼容 (LM Studio / vLLM / llama.cpp)' },
] as const;

const BASEURL_PRESETS = [
  { label: 'Ollama (http://localhost:11434)', value: 'http://localhost:11434' },
  { label: 'LM Studio (http://localhost:1234/v1)', value: 'http://localhost:1234/v1' },
  { label: 'vLLM (http://localhost:8000/v1)', value: 'http://localhost:8000/v1' },
  { label: 'llama.cpp (http://localhost:8080/v1)', value: 'http://localhost:8080/v1' },
  { label: 'Custom', value: '__custom__' },
];

const KEYS = {
  provider: 'sry:local:provider',
  baseUrl: 'sry:local:baseUrl',
  model: 'sry:local:model',
  apiKey: 'sry:local:apiKey',
  timeoutMs: 'sry:local:timeoutMs',
} as const;

function readLs(key: string, fallback = ''): string {
  if (typeof localStorage === 'undefined') return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function writeLs(key: string, value: string) {
  if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
}

export function LocalProviderCard() {
  const [provider, setProvider] = useState(readLs(KEYS.provider, 'ollama'));
  const [baseUrl, setBaseUrl] = useState(readLs(KEYS.baseUrl, 'http://localhost:11434'));
  const [model, setModel] = useState(readLs(KEYS.model));
  const [apiKey, setApiKey] = useState(readLs(KEYS.apiKey));
  const [timeoutMs, setTimeoutMs] = useState(readLs(KEYS.timeoutMs, '30000'));
  const [status, setStatus] = useState<string>('');
  const [testing, setTesting] = useState(false);

  useEffect(() => { writeLs(KEYS.provider, provider); }, [provider]);
  useEffect(() => { writeLs(KEYS.baseUrl, baseUrl); }, [baseUrl]);
  useEffect(() => { writeLs(KEYS.model, model); }, [model]);
  useEffect(() => { writeLs(KEYS.apiKey, apiKey); }, [apiKey]);
  useEffect(() => { writeLs(KEYS.timeoutMs, timeoutMs); }, [timeoutMs]);

  async function testConnection() {
    setTesting(true);
    setStatus('Testing…');
    try {
      const url = baseUrl.replace(/\/$/, '') + (provider === 'ollama' ? '/api/tags' : '/models');
      const headers: Record<string, string> = {};
      if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        setStatus(`OK Connected (${provider} reachable)`);
      } else {
        setStatus(`${res.status} ${res.statusText}`);
      }
    } catch (e) {
      setStatus(`${(e as Error).message}`);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="bg-cream border border-[#c9a98d] rounded-md p-3.5 flex flex-col" data-testid="local-provider-card">
      <h2 className="text-xs font-semibold text-ink mb-1">🖥 本地 LLM</h2>
      <p className="text-[10px] text-muted mb-2.5">用你本机跑的模型生成,省 Cloudflare 额度。</p>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-[10px] text-ink mb-0.5 h-3" htmlFor="sry-local-prov">Provider</label>
          <select
            id="sry-local-prov"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] h-6.5"
            aria-label="Provider"
          >
            {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-ink mb-0.5 h-3" htmlFor="sry-local-url-preset">Base URL 预设 (Preset)</label>
          <select
            id="sry-local-url-preset"
            value={BASEURL_PRESETS.some(p => p.value === baseUrl) ? baseUrl : '__custom__'}
            onChange={(e) => {
              const v = e.target.value;
              if (v !== '__custom__') setBaseUrl(v);
            }}
            className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] h-6.5"
            aria-label="Base URL 预设"
          >
            {BASEURL_PRESETS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-[10px] text-ink mb-0.5 h-3" htmlFor="sry-local-url">Base URL</label>
        <input
          id="sry-local-url"
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="http://localhost:11434"
          className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[10px] font-mono h-6.5"
          aria-label="Base URL"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-[10px] text-ink mb-0.5 h-3" htmlFor="sry-local-model">本地模型</label>
          <input
            id="sry-local-model"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={provider === 'ollama' ? 'llama3.1:8b' : 'qwen2.5-coder-7b-instruct'}
            className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] h-6.5"
            aria-label="本地模型"
          />
        </div>
        <div>
          <label className="block text-[10px] text-ink mb-0.5 h-3" htmlFor="sry-local-timeout">超时(ms)</label>
          <input
            id="sry-local-timeout"
            type="number"
            min={1000}
            max={120000}
            value={timeoutMs}
            onChange={(e) => setTimeoutMs(e.target.value)}
            className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] h-6.5"
            aria-label="Timeout"
          />
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-[10px] text-ink mb-0.5 h-3" htmlFor="sry-local-key">本地 API Key (可选)</label>
        <input
          id="sry-local-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-white border border-[#c9a98d] rounded px-2 py-1 text-[11px] font-mono h-6.5"
          aria-label="本地 API Key"
        />
      </div>

      <button
        type="button"
        onClick={testConnection}
        disabled={testing || !baseUrl}
        className="w-full bg-white border border-[#c9a98d] text-ink py-1.5 text-[11px] rounded mb-1.5 hover:bg-paper disabled:opacity-50"
      >
        {testing ? 'Testing…' : 'Test connection'}
      </button>

      {status && <p className="text-[10px] text-muted">{status}</p>}
    </div>
  );
}
