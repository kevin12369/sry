import type { ReactNode } from 'react';

type PaperProps = {
  children: ReactNode;
  fold?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
};

const padMap = { sm: 'p-3', md: 'p-5', lg: 'p-7' } as const;

export function Paper({ children, fold = false, padding = 'md', className = '' }: PaperProps) {
  return (
    <div
      className={[
        'bg-cream rounded-paper shadow-paper border border-[#d4b896]',
        padMap[padding],
        fold ? 'paper-fold' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}
