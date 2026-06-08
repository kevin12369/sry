'use client';
import { useState } from 'react';
import { Envelope } from './Envelope';
import type { Style, StyleMap } from '@sry/shared';

export function LetterStack({ letters, onOpen }: { letters: StyleMap; onOpen: (s: Style) => void }) {
  const [expanded, setExpanded] = useState<Style | null>(null);
  return (
    <div className="relative max-w-2xl mx-auto" style={{ minHeight: 380 }}>
      {(Object.keys(letters) as Style[]).map((style, i) => (
        <div
          key={style}
          className="absolute w-full"
          style={{ left: 0, top: expanded === style ? 0 : 0 }}
        >
          <Envelope
            style={style}
            body={letters[style] || ''}
            index={i}
            expanded={expanded === style}
            onClick={() => {
              setExpanded(expanded === style ? null : style);
              onOpen(style);
            }}
          />
        </div>
      ))}
    </div>
  );
}
