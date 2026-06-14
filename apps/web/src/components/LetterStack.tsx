'use client';
import { EnvelopeRow } from './Envelope';
import type { LetterEntry } from '@/lib/state-machine';
import type { SceneId, StyleId } from '@/data/prompts';
import { SCENE_NAMES_ZH } from '@/data/prompts';

export function LetterStack({
  letters,
  onOpen,
  opened,
  scene,
}: {
  letters: LetterEntry[];
  onOpen: (s: StyleId) => void;
  opened: StyleId | null;
  scene: SceneId;
}) {
  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      <p className="text-xs text-muted text-center">
        {SCENE_NAMES_ZH[scene]}场景 · 5 封人设任挑一封
      </p>
      <ul className="space-y-2" role="list">
        {letters.map((l) => (
          <li key={l.style}>
            <EnvelopeRow
              style={l.style}
              body={l.body}
              roast={l.roast}
              isOpen={opened === l.style}
              onClick={() => onOpen(l.style)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
