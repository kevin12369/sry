import type { ReactNode } from 'react';
import { Paper } from './Paper';

type ChatStepProps = {
  step: 1 | 2 | 3;
  question: string;
  hint?: string;
  children: ReactNode;
};

export function ChatStep({ step, question, hint, children }: ChatStepProps) {
  return (
    <Paper padding="lg" className="space-y-4">
      {/* PR #2 P1 Fix 1: 步骤数字徽章锁 w-10 h-10 (40px) 圆形,数字居中 */}
      <div className="flex items-center gap-3">
        <span
          data-step-badge={step}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-seal text-cream text-lg font-semibold leading-none"
        >
          {step}
        </span>
        <div>
          <h2 className="text-xl font-semibold">{question}</h2>
          {hint && <p className="text-sm text-muted mt-1">{hint}</p>}
        </div>
      </div>
      {children}
    </Paper>
  );
}
