'use client';
import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

type Phase = 'typing' | 'sent' | 'read' | 'silence';

// 选"已读不回"风格 OR SPIN 命中"已读不回"时显示
// 3 秒伪动画: 2 个气泡(你发 → 对方已读)→ 显示"对方没回"
// 4 状态时序切换, total ~3.5s
// 用 setTimeout 链不用 useEffect 多 dependency
export function ReadReceipt({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('typing');

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('sent'), 800);
    const t2 = window.setTimeout(() => setPhase('read'), 1700);
    const t3 = window.setTimeout(() => setPhase('silence'), 2500);
    const t4 = window.setTimeout(() => onComplete(), 3500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      data-read-receipt
      data-phase={phase}
      className="max-w-md mx-auto rounded-paper border border-[#d4b896] bg-cream p-5 space-y-3"
    >
      {phase === 'typing' && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-seal text-cream flex items-center justify-center text-sm">你</div>
          <div className="bg-paper border border-[#d4b896] rounded-2xl px-3 py-2 text-sm text-muted animate-pulse">
            ...
          </div>
        </div>
      )}
      {phase === 'sent' && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-seal text-cream flex items-center justify-center text-sm">你</div>
          <div className="bg-paper border border-[#d4b896] rounded-2xl px-3 py-2 text-sm text-ink">
            (已发送)
          </div>
          <span className="text-[10px] text-muted">已送达</span>
        </div>
      )}
      {phase === 'read' && (
        <div className="flex items-center gap-2 opacity-70">
          <div className="w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center text-sm">TA</div>
          <div className="bg-zinc-700 text-cream rounded-2xl px-3 py-2 text-sm">已读</div>
        </div>
      )}
      {phase === 'silence' && (
        <div className="text-center py-4 space-y-2">
          <div className="text-2xl">👻</div>
          <p className="text-lg font-semibold text-ink">对方没回。</p>
          <p className="text-xs text-muted">已读不回的最高境界。</p>
        </div>
      )}
    </div>
  );
}