'use client';
import { useState } from 'react';
import { HandwrittenLogo } from '@/components/HandwrittenLogo';
import { SceneForm, type SceneFormValue } from '@/components/SceneForm';
import { LetterStack } from '@/components/LetterStack';
import { LetterPage } from '@/components/LetterPage';
import { MailShareCard } from '@/components/MailShareCard';
import { MemeShareCard } from '@/components/MemeShareCard';
import { PersonaRoulette } from '@/components/PersonaRoulette';
import { ByokSettings } from '@/components/ByokSettings';
import { Hero } from '@/components/Hero';
import { StatusBadges } from '@/components/StatusBadges';
import { StyleCompare } from '@/components/StyleCompare';
import { FunElements } from '@/components/FunElements';
import { HowItWorks } from '@/components/HowItWorks';
import { WhoIsItFor } from '@/components/WhoIsItFor';
import { RunLocally } from '@/components/RunLocally';
import { FAQ } from '@/components/FAQ';
import { Roadmap } from '@/components/Roadmap';
import { useGenerate } from '@/hooks/useGenerate';
import { useShareHash, useMemeHash } from '@/hooks/useShare';
import { useSettings } from '@/hooks/useSettings';
import { type SceneId, type StyleId, STYLE_NAMES_ZH, SCENE_NAMES_ZH } from '@/data/prompts';
import { Paper } from '@/components/Paper';

export default function Page() {
  const [settings] = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const sharedPayload = useShareHash();
  const memePayload = useMemeHash();
  const { state, compose, reset } = useGenerate();
  const [opened, setOpened] = useState<StyleId | null>(null);

  async function handleSubmit(v: SceneFormValue) {
    setOpened(null);
    await compose(v.scene, v.situation);
  }

  function handleSpin(style: StyleId) {
    // PR #3: SPIN previews a sample letter for the chosen style.
    // We don't burn LLM quota; for now we no-op and let the user
    // continue through SceneForm. The component itself still spins
    // and announces the chosen style.
    void style;
  }

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

  if (memePayload) {
    return (
      <main className="min-h-screen py-8 px-4">
        <HandwrittenLogo />
        <div className="mt-6">
          <MemeShareCard
            payload={memePayload}
            onWriteOwn={() => { window.location.hash = ''; window.location.reload(); }}
          />
        </div>
      </main>
    );
  }

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
        <p className="mt-3 text-center text-[10px] text-muted">
          来源: {state.source === 'llm' ? 'LLM 实时生成' : state.source === 'mixed' ? 'LLM + 预设范文兜底' : '预设范文'}
        </p>
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

  // PR #4: idle 状态 = Hero + 9 段宣传页模板(Header + Demo form + Footer)
  // Hero CTA 跳 #demo,顺序:Hero / StatusBadges / StyleCompare / FunElements / HowItWorks / WhoIsItFor / RunLocally / FAQ / Roadmap
  // Footer 已在 layout.tsx 全局挂载
  return (
    <>
      <Hero />
      <StatusBadges />
      <main id="demo" className="py-8 px-4 max-w-4xl mx-auto">
        <HandwrittenLogo />
        <div className="mt-6">
          <PersonaRoulette onSpin={handleSpin} />
        </div>
        <div className="mt-6">
          <SceneForm onSubmit={handleSubmit} defaultTone={settings.defaultTone} />
        </div>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            className="text-xs text-muted hover:text-ink"
          >
            {showSettings ? '收起' : '展开'} LLM 设置 (BYOK)
          </button>
        </div>
        {showSettings && (
          <div className="mt-4">
            <ByokSettings />
          </div>
        )}
        <footer className="mt-12 text-center text-xs text-muted">
          发不发随你。我们不管,也不想知道。给反馈写信到{' '}
          <a href="mailto:491750329@qq.com" className="text-seal hover:underline wavy-underline">
            491750329@qq.com
          </a>
          。
        </footer>
        <p className="mt-2 text-center text-[10px] text-muted">
          PR #2: 5×6 prompt table + LLM 直连(BYOK){STYLE_NAMES_ZH.funny}/{STYLE_NAMES_ZH.sincere}/{STYLE_NAMES_ZH.deflect}/{STYLE_NAMES_ZH.legal}/{STYLE_NAMES_ZH.silent}
        </p>
      </main>
      <StyleCompare />
      <FunElements />
      <HowItWorks />
      <WhoIsItFor />
      <RunLocally />
      <FAQ />
      <Roadmap />
    </>
  );
}