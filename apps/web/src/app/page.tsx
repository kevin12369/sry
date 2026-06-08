'use client';
import { useEffect, useState } from 'react';
import { ApologyForm } from '@/components/ApologyForm.js';
import { ComparisonGrid } from '@/components/ComparisonGrid.js';
import { SkeletonCard } from '@/components/SkeletonCard.js';
import { ShareButton } from '@/components/ShareButton.js';
import { SettingsDrawer } from '@/components/SettingsDrawer.js';
import { RejectScreen } from '@/components/RejectScreen.js';
import { AllFailedScreen } from '@/components/AllFailedScreen.js';
import { useGenerate } from '@/hooks/useGenerate.js';
import { useShareHash } from '@/hooks/useShare.js';
import { useSettings } from '@/hooks/useSettings.js';
import { Button } from '@/components/ui/button.js';
import { Settings as SettingsIcon, ArrowUpDown } from 'lucide-react';
import { STYLES, type Style, type StyleMap, type RejectReason } from '@sry/shared';

export default function Page() {
  const [settings, setSettings] = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sort, setSort] = useState<'style' | 'length'>('style');
  const [letters, setLetters] = useState<StyleMap | null>(null);
  const [shared, setShared] = useState<StyleMap | null>(null);
  const [sharedInput, setSharedInput] = useState<{ situation: string; personality: string } | null>(null);
  const { loading, error, data, run } = useGenerate();
  const hashPayload = useShareHash();

  useEffect(() => {
    if (hashPayload) {
      setShared(hashPayload.letters);
      setSharedInput({ situation: hashPayload.situation, personality: hashPayload.personality });
    }
  }, [hashPayload]);

  useEffect(() => {
    if (data) setLetters(data.letters);
  }, [data]);

  async function handleSubmit(r: { situation: string; personality: 'sensitive' | 'direct' | 'cold' }) {
    setLetters(null);
    await run(r, { model: settings.model, apiKey: settings.apiKey });
  }

  async function handleRetry(style: Style) {
    if (!letters) return;
    // simple per-style retry: re-call full route and merge; for MVP just re-submit
    if (sharedInput) {
      await run(
        { situation: sharedInput.situation, personality: sharedInput.personality as 'sensitive' | 'direct' | 'cold' },
        { model: settings.model, apiKey: settings.apiKey }
      );
    } else {
      // nothing to retry; ignore
    }
    void style;
  }

  // Shared view (URL hash detected)
  if (shared) {
    return (
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">嘴笨助手 · 分享视图</h1>
          <Button variant="outline" onClick={() => { setShared(null); window.location.hash = ''; }}>我也写一封</Button>
        </header>
        {sharedInput && (
          <p className="text-xs text-slate-500">原情境:{sharedInput.situation} · 性格:{sharedInput.personality}</p>
        )}
        <ComparisonGrid letters={shared} loading={false} onRetry={() => {}} sort={sort} />
      </main>
    );
  }

  // Reject view
  if (error && (['real-person', 'harassment', 'too-long', 'too-short', 'rate-limit', 'quota-exceeded', 'kill-switch'] as RejectReason[]).includes(error.code as RejectReason)) {
    return (
      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">嘴笨助手</h1>
          <Button size="sm" variant="ghost" onClick={() => setSettingsOpen(true)} aria-label="设置">
            <SettingsIcon size={16} />
          </Button>
        </header>
        <RejectScreen reason={error.code as RejectReason} onReset={() => window.location.reload()} />
        <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onChange={setSettings} />
      </main>
    );
  }

  // Main view
  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">嘴笨助手</h1>
        <Button size="sm" variant="ghost" onClick={() => setSettingsOpen(true)} aria-label="设置">
          <SettingsIcon size={16} />
        </Button>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ApologyForm loading={loading} onSubmit={handleSubmit} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">对比视图</h2>
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1"><input type="radio" checked={sort==='style'} onChange={() => setSort('style')} />按风格</label>
              <label className="flex items-center gap-1"><input type="radio" checked={sort==='length'} onChange={() => setSort('length')} />按长度</label>
              <ArrowUpDown size={12} className="text-slate-400" />
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {STYLES.map((s) => <SkeletonCard key={s} />)}
            </div>
          ) : letters ? (
            STYLES.every((s) => !letters[s]) ? (
              <AllFailedScreen onRetry={() => run(
                { situation: sharedInput?.situation ?? '', personality: (sharedInput?.personality as 'sensitive' | 'direct' | 'cold') ?? 'direct' },
                { model: settings.model, apiKey: settings.apiKey }
              )} />
            ) : (
              <>
                <div className="flex justify-end"><ShareButton letters={letters} situation={''} personality={'direct'} /></div>
                <ComparisonGrid letters={letters} loading={false} onRetry={handleRetry} sort={sort} />
              </>
            )
          ) : (
            <p className="text-sm text-slate-500">先在左侧输入情境,生成 5 种风格。</p>
          )}
          {error && error.code === 'network' && (
            <p className="text-sm text-rose-600">网络错误:{error.message}</p>
          )}
        </div>
      </section>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onChange={setSettings} />
      <footer className="text-xs text-slate-500 text-center pt-4">
        被误伤了?写信给 <a className="underline" href="mailto:feedback@REPLACE.example">feedback@REPLACE.example</a> 反馈。
      </footer>
    </main>
  );
}

// Render the "all 5 styles failed" full-page fallback when every LetterCard body
// is empty. Spec section 8: "5 路全失败 → 整页降级:大字号'服务暂时不可用,5 分钟后重试'".
// This is detected in the main view's `letters` branch and rendered in Task 44.
