'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Paper } from '@/components/Paper';
import { HandwrittenLogo } from '@/components/HandwrittenLogo';
import { ChatForm, type ChatFormValue } from '@/components/ChatForm';
import { LetterStack } from '@/components/LetterStack';
import { LetterPage } from '@/components/LetterPage';
import { MailShareCard } from '@/components/MailShareCard';
import { RejectScreen } from '@/components/RejectScreen';
import { AllFailedScreen } from '@/components/AllFailedScreen';
import { useGenerate } from '@/hooks/useGenerate';
import { useShareHash } from '@/hooks/useShare';
import { useSettings } from '@/hooks/useSettings';
import { isLocalProviderActive, loadLocalSettings } from '@/lib/localSettings';
import { STYLES, type Style, type StyleMap, type RejectReason, type ModelId } from '@sry/shared';

const REJECT_REASONS: RejectReason[] = [
  'real-person', 'harassment', 'too-long', 'too-short',
  'rate-limit', 'quota-exceeded', 'kill-switch',
];

export default function Page() {
  const [settings, setSettings] = useSettings();
  const [letters, setLetters] = useState<StyleMap | null>(null);
  const [opened, setOpened] = useState<Style | null>(null);
  const [situation, setSituation] = useState<string>('');
  const [personality, setPersonality] = useState<string>('');
  const [useLocal, setUseLocal] = useState(false);
  const [localLabel, setLocalLabel] = useState('');
  const sharedPayload = useShareHash();
  const { loading, error, data, run } = useGenerate();

  useEffect(() => { if (data) setLetters(data.letters); }, [data]);

  useEffect(() => {
    if (isLocalProviderActive()) {
      setUseLocal(true);
      const ls = loadLocalSettings();
      setLocalLabel(`${ls.provider} @ ${ls.baseUrl || '(no URL)'}`);
    }
  }, []);

  async function handleSubmit(v: ChatFormValue) {
    setSituation(v.situation);
    setPersonality(v.personality);
    setLetters(null);
    setOpened(null);
    const req = { situation: v.situation, personality: v.personality };
    const model: ModelId = (useLocal
      ? (loadLocalSettings().provider || 'ollama')
      : settings.model) as ModelId;
    const apiOpts: { model: ModelId; apiKey: string } = {
      model,
      apiKey: settings.apiKey,
    };
    await run(req, apiOpts);
  }

  async function handleRetry() {
    if (!situation || !personality) return;
    const req = { situation, personality: personality as 'sensitive' | 'direct' | 'cold' };
    const model: ModelId = (useLocal
      ? (loadLocalSettings().provider || 'ollama')
      : settings.model) as ModelId;
    await run(req, { model, apiKey: settings.apiKey });
  }

  const styles = letters ? (Object.keys(letters) as Style[]) : [];
  const openedIndex = opened ? styles.indexOf(opened) : -1;
  const prevStyle = styles[(openedIndex - 1 + styles.length) % styles.length];
  const nextStyle = styles[(openedIndex + 1) % styles.length];
  const handlePrev = () => setOpened(prevStyle);
  const handleNext = () => setOpened(nextStyle);

  // 1. Share view
  if (sharedPayload) {
    return (
      <main className="min-h-screen py-8 px-4">
        <HandwrittenLogo />
        <div className="mt-6">
          <MailShareCard
            letters={sharedPayload.letters}
            situation={sharedPayload.situation}
            personality={sharedPayload.personality}
            onWriteOwn={() => { window.location.hash = ''; window.location.reload(); }}
          />
        </div>
      </main>
    );
  }

  // 2. Reject view
  if (error && REJECT_REASONS.includes(error.code as RejectReason)) {
    return (
      <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
        <HandwrittenLogo />
        <div className="mt-6">
          <RejectScreen
            reason={error.code as RejectReason}
            onReset={() => window.location.reload()}
          />
        </div>
      </main>
    );
  }

  // 3. All-failed view
  if (letters && STYLES.every((s) => !letters[s])) {
    return (
      <main className="min-h-screen py-8 px-4">
        <HandwrittenLogo />
        <div className="mt-6">
          <AllFailedScreen onRetry={handleRetry} />
        </div>
      </main>
    );
  }

  // 4. LetterPage view (one letter opened)
  if (opened && letters) {
    return (
      <main className="min-h-screen py-8 px-4">
        <HandwrittenLogo />
        <div className="mt-6">
          <LetterPage
            style={opened}
            body={letters[opened] ?? ''}
            allLetters={letters}
            onRetry={handleRetry}
            onClose={() => setOpened(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            currentIndex={openedIndex + 1}
            totalCount={styles.length}
          />
        </div>
      </main>
    );
  }

  // 5a. Loading view (waiting for the API response)
  if (loading) {
    return (
      <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
        <HandwrittenLogo />
        <Paper padding="lg" className="mt-6 text-center">
          <div className="text-seal text-2xl mb-3">写信中…</div>
          <p className="text-sm text-muted">通常 5-15 秒</p>
        </Paper>
      </main>
    );
  }

  // 5b. LetterStack view (letters ready, none opened yet)
  if (letters) {
    return (
      <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
        <HandwrittenLogo />
        <div className="mt-6">
          <LetterStack letters={letters} onOpen={setOpened} opened={opened} />
        </div>
      </main>
    );
  }

  // 6. Default: 4-step chat
  return (
    <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-3">
        <HandwrittenLogo />
        <div className="flex flex-col items-end gap-1.5 mt-2">
          <button
            type="button"
            data-testid="local-toggle"
            aria-pressed={useLocal}
            onClick={() => {
              const next = !useLocal;
              setUseLocal(next);
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('sry:useLocal', String(next));
              }
            }}
            className={`text-[11px] px-2.5 py-1 rounded border ${
              useLocal
                ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                : 'border-[#c9a98d] text-muted bg-white'
            }`}
          >
            {useLocal ? `Local: ${localLabel}` : 'Cloud'}
          </button>
          <Link
            href="/portfolio"
            className="text-[10px] text-muted hover:text-ink"
          >
            About
          </Link>
          <Link
            href="/settings"
            className="text-[10px] text-muted hover:text-ink"
          >
            设置
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <ChatForm onSubmit={handleSubmit} defaultTone={settings.defaultTone} />
      </div>
      <footer className="mt-12 text-center text-xs text-muted">
        被误伤了?写信给{' '}
        <a href="mailto:491750329@qq.com" className="text-seal hover:underline wavy-underline">
          491750329@qq.com
        </a>
        {' '}反馈。
      </footer>
    </main>
  );
}
