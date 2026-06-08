'use client';
import type { ReactNode } from 'react';

type SealButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit';
};

export function SealButton({ onClick, children, variant = 'primary', disabled, type = 'button' }: SealButtonProps) {
  const base = 'inline-flex items-center gap-2 px-5 py-2 rounded transition-colors';
  const styles = variant === 'primary'
    ? 'bg-seal text-cream hover:bg-[#a84938] disabled:opacity-50'
    : 'bg-cream text-ink border border-ink hover:bg-paper';
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {/* Wax seal icon */}
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="currentColor" opacity="0.7" />
        <circle cx="7" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      {children}
    </button>
  );
}
