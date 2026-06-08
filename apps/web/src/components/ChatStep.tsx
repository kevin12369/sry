import type { ReactNode } from 'react';
import { Paper } from './Paper';

type ChatStepProps = {
  step: 1 | 2 | 3 | 4;
  question: string;
  hint?: string;
  children: ReactNode;
};

const STEP_LABELS: Record<number, string> = {
  1: '发生了什么?',
  2: '对方是谁?',
  3: '想达到什么?',
  4: '语气倾向?',
};

export function ChatStep({ step, question, hint, children }: ChatStepProps) {
  return (
    <Paper padding="lg" className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="text-seal text-3xl font-semibold italic">{step}</span>
        <div>
          <h2 className="text-xl font-semibold">{question}</h2>
          {hint && <p className="text-sm text-muted mt-1">{hint}</p>}
        </div>
      </div>
      {children}
    </Paper>
  );
}
