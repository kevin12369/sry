'use client';
import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <div className={clsx('fixed inset-0 z-40', open ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div
        onClick={onClose}
        className={clsx('absolute inset-0 bg-black/30 transition-opacity', open ? 'opacity-100' : 'opacity-0')}
      />
      <div
        className={clsx(
          'absolute right-0 top-0 h-full w-80 bg-cream shadow-lifted border-l border-[#c9a98d] p-5 transition-transform',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {children}
      </div>
    </div>
  );
}
