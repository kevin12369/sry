'use client';
import { LetterCard } from './LetterCard.js';
import type { Style, StyleMap } from '@sry/shared';
import { countChars } from '@/lib/wordCount.js';
import { useMemo } from 'react';

const ORDER: Style[] = ['funny', 'sincere', 'shameless', 'legal-cold', 'silent-treatment'];

export function ComparisonGrid({
  letters,
  loading,
  onRetry,
  sort,
}: {
  letters: StyleMap;
  loading: boolean;
  onRetry: (s: Style) => void;
  sort: 'style' | 'length';
}) {
  const ordered = useMemo<Style[]>(() => {
    if (sort === 'style') return ORDER;
    return [...ORDER].sort((a, b) => countChars(letters[a] ?? '') - countChars(letters[b] ?? ''));
  }, [sort, letters]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {ordered.map((s) => (
        <div key={s} role="region" aria-label="道歉卡片">
          <LetterCard style={s} body={letters[s] ?? ''} loading={loading} onRetry={onRetry} />
        </div>
      ))}
    </div>
  );
}
