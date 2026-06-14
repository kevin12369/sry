'use client';
import { useState } from 'react';
import { STYLES, STYLE_NAMES_ZH, type StyleId } from '@/data/prompts';
import { SAMPLE_LETTERS } from '@/data/sample-letters';

interface Props {
  onSpin: (style: StyleId) => void;
  disabled?: boolean;
}

// 主页 4 状态机 composing 之前的 idle 状态:
// 用户输入情境前可点 SPIN, 随机选 1 风格 + 显示其 1 封信(从 sample-letters.ts)
// 不消耗 LLM 配额, 纯本地
export function PersonaRoulette({ onSpin, disabled }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  function spin() {
    if (spinning || disabled) return;
    const idx = Math.floor(Math.random() * STYLES.length);
    const target = STYLES[idx] as StyleId;
    // 360° base + 5 segments x 72° each, offset to land near center of target
    const segDeg = 360 / STYLES.length;
    const next = angle + 360 + segDeg * idx + segDeg / 2;
    setAngle(next);
    setSpinning(true);
    setToast(`今晚你当 ${STYLE_NAMES_ZH[target]} 人`);
    window.setTimeout(() => {
      setSpinning(false);
      setToast(null);
      onSpin(target);
    }, 1500);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        role="button"
        aria-label="SPIN 选风格"
        onClick={spin}
        disabled={disabled || spinning}
        data-spin-btn
        className="w-28 h-28 rounded-full bg-gradient-to-br from-seal to-[#a84938] text-cream text-lg font-semibold shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}
      >
        <span className="block" style={{ transform: `rotate(${-angle}deg)`, transition: spinning ? 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}>
          SPIN
        </span>
      </button>
      <p className="text-xs text-muted">点一下试试今晚当什么人</p>
      {toast && (
        <div
          role="status"
          className="text-sm text-ink bg-cream border border-seal rounded px-3 py-1"
        >
          {toast}
        </div>
      )}
      {/* expose a stable sample-letter helper for tests / future previews */}
      <span hidden data-spin-samples={JSON.stringify(SAMPLE_LETTERS)} />
    </div>
  );
}