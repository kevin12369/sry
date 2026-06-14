'use client';
import { useState } from 'react';
import { HandwrittenLogo } from '@/components/HandwrittenLogo';
import { SceneForm, type SceneFormValue } from '@/components/SceneForm';
import { LetterStack } from '@/components/LetterStack';
import { LetterPage } from '@/components/LetterPage';
import { MailShareCard } from '@/components/MailShareCard';
import { useGenerate } from '@/hooks/useGenerate';
import { useShareHash } from '@/hooks/useShare';
import { useSettings } from '@/hooks/useSettings';
import { type SceneId, type StyleId, STYLE_NAMES_ZH, SCENE_NAMES_ZH } from '@/data/prompts';
import { Paper } from '@/components/Paper';

export default function Page() {
  const [settings] = useSettings();
  const sharedPayload = useShareHash();
  const { state, compose, reset } = useGenerate();
  const [opened, setOpened] = useState<StyleId | null>(null);

  async function handleSubmit(v: SceneFormValue) {
    setOpened(null);
    await compose(v.scene, v.situation);
  }

  // 1. Share view
  if (sharedPayload) {
    return (
      <main className="min-h-screen py-8 px-4">
        <HandwrittenLogo />
        <div className="mt-6">
          <MailShareCard
            payload={sharedPayload}
            onWriteOwn={() => { window.location.hash = ''; window.location.reload(); }}
          />
        </div>
      </main>
    );
  }

  // 2. Error view (kept minimal — PR #1 is offline)
  if (state.stage === 'error') {
    return (
      <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
        <HandwrittenLogo />
        <Paper padding="lg" className="mt-6 text-center space-y-3">
          <h2 className="text-lg font-semibold text-seal">出了点小问题</h2>
          <p className="text-sm text-muted">{state.error}</p>
          <button
            onClick={reset}
            className="bg-ink text-cream px-5 py-2 rounded hover:bg-dark transition-colors"
          >
            再来一次
          </button>
        </Paper>
      </main>
    );
  }

  // 3. LetterPage view (one letter opened)
  if (opened && state.stage === 'ready') {
    const letter = state.letters.find((l) => l.style === opened);
    if (letter) {
      const idx = state.letters.findIndex((l) => l.style === opened);
      const prev = state.letters[(idx - 1 + state.letters.length) % state.letters.length];
      const next = state.letters[(idx + 1) % state.letters.length];
      return (
        <main className="min-h-screen py-8 px-4">
          <HandwrittenLogo />
          <div className="mt-6">
            <LetterPage
              style={opened}
              body={letter.body}
              roast={letter.roast}
              scene={state.scene}
              onClose={() => setOpened(null)}
              onPrev={() => setOpened(prev.style)}
              onNext={() => setOpened(next.style)}
              currentIndex={idx + 1}
              totalCount={state.letters.length}
            />
          </div>
        </main>
      );
    }
  }

  // 4. Composing view
  if (state.stage === 'composing') {
    return (
      <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
        <HandwrittenLogo />
        <Paper padding="lg" className="mt-6 text-center">
          <div className="text-seal text-2xl mb-3">选人设中…</div>
          <p className="text-sm text-muted">{SCENE_NAMES_ZH[state.scene]}场景 · 1 秒就好</p>
        </Paper>
      </main>
    );
  }

  // 5. LetterStack view (letters ready, none opened)
  if (state.stage === 'ready') {
    return (
      <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
        <HandwrittenLogo />
        <div className="mt-6">
          <LetterStack
            letters={state.letters}
            onOpen={setOpened}
            opened={opened}
            scene={state.scene}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={reset}
            className="text-sm text-muted hover:text-ink"
          >
            ← 回到表单
          </button>
        </div>
      </main>
    );
  }

  // 6. Default: scene form
  return (
    <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
      <HandwrittenLogo />
      <div className="mt-6">
        <SceneForm onSubmit={handleSubmit} defaultTone={settings.defaultTone} />
      </div>
      <footer className="mt-12 text-center text-xs text-muted">
        发不发随你。我们不管,也不想知道。给反馈写信到{' '}
        <a href="mailto:491750329@qq.com" className="text-seal hover:underline wavy-underline">
          491750329@qq.com
        </a>
        。
      </footer>
      <p className="mt-2 text-center text-[10px] text-muted">
        PR #1: 5 封预设范文兜底,PR #2 接入 LLM。{STYLE_NAMES_ZH.funny}/{STYLE_NAMES_ZH.sincere}/{STYLE_NAMES_ZH.deflect}/{STYLE_NAMES_ZH.legal}/{STYLE_NAMES_ZH.silent}
      </p>
    </main>
  );
}
