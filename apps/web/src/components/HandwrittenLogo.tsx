import Link from 'next/link';

export function HandwrittenLogo({ settingsHref = '/settings' }: { settingsHref?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="16" fill="#c75d4a" />
          <circle cx="18" cy="18" r="13" fill="none" stroke="#a84938" strokeWidth="0.5" strokeDasharray="1 1" />
          <text x="18" y="22" fontSize="14" textAnchor="middle" fill="#fdf6ec"
            fontWeight="bold" fontStyle="italic">S</text>
        </svg>
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">
            Sry.lol
          </h1>
          <p className="text-[10px] text-muted">嘴替游乐场</p>
        </div>
      </div>
      <Link
        href={settingsHref}
        aria-label="设置"
        className="text-muted hover:text-ink transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </Link>
    </div>
  );
}
