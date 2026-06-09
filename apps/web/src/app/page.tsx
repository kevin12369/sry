'use client';
import { useEffect, useState } from 'react';
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
import { STYLES, type Style, type StyleMap, type RejectReason } from '@sry/shared';

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
  const sharedPayload = useShareHash();
  const { loading, error, data, run } = useGenerate();

  useEffect(() => { if (data) setLetters(data.letters); }, [data]);

  async function handleSubmit(v: ChatFormValue) {
    setSituation(v.situation);
    setPersonality(v.personality);
    setLetters(null);
    setOpened(null);
    await run({ situation: v.situation, personality: v.personality },
      { model: settings.model, apiKey: settings.apiKey });
  }

  async function handleRetry() {
    if (!situation || !personality) return;
    await run({ situation, personality: personality as 'sensitive' | 'direct' | 'cold' },
      { model: settings.model, apiKey: settings.apiKey });
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
      <main className="min-h-screen py-6 px-4">
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
      <main className="min-h-screen py-6 px-4 max-w-2xl mx-auto">
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
      <main className="min-h-screen py-6 px-4">
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
      <main className="min-h-screen py-6 px-4">
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
      <main className="min-h-screen py-6 px-4 max-w-2xl mx-auto">
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
      <main className="min-h-screen py-6 px-4 max-w-2xl mx-auto">
        <HandwrittenLogo />
        <div className="mt-6">
          <LetterStack letters={letters} onOpen={setOpened} opened={opened} />
        </div>
      </main>
    );
  }

  // 6. Default: 4-step chat
  return (
    <main className="min-h-screen py-6 px-4 max-w-2xl mx-auto">
      <HandwrittenLogo />
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
