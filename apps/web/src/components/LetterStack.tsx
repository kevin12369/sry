'use client';
import { EnvelopeRow } from './Envelope';
import type { Style, StyleMap } from '@sry/shared';

export function LetterStack({
  letters,
  onOpen,
  opened,
}: {
  letters: StyleMap;
  onOpen: (s: Style) => void;
  opened: Style | null;
}) {
  return (
    <ul className="space-y-2 max-w-4xl mx-auto" role="list">
      {(Object.keys(letters) as Style[]).map((style) => (
        <li key={style}>
          <EnvelopeRow
            style={style}
            body={letters[style] || ''}
            isOpen={opened === style}
            onClick={() => onOpen(style)}
          />
        </li>
      ))}
    </ul>
  );
}
