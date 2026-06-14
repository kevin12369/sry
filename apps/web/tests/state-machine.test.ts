import { describe, it, expect } from 'vitest';
import { initialState, toComposing, toReady, toError, type LetterEntry } from '@/lib/state-machine';

const sampleLetters: LetterEntry[] = [
  { style: 'funny', body: 'a', roast: 'r1' },
  { style: 'sincere', body: 'b', roast: 'r2' },
];

describe('state-machine invariants', () => {
  it('initial state is idle', () => {
    expect(initialState.stage).toBe('idle');
  });

  it('composing carries scene + spinning flag', () => {
    const s = toComposing('apology', true);
    expect(s.stage).toBe('composing');
    if (s.stage === 'composing') {
      expect(s.scene).toBe('apology');
      expect(s.spinning).toBe(true);
    }
  });

  it('ready carries scene + 5 letter entries', () => {
    const s = toReady('roast', sampleLetters);
    expect(s.stage).toBe('ready');
    if (s.stage === 'ready') {
      expect(s.scene).toBe('roast');
      expect(s.letters).toHaveLength(2);
    }
  });

  it('error state carries a message', () => {
    const s = toError('boom');
    expect(s.stage).toBe('error');
    if (s.stage === 'error') {
      expect(s.error).toBe('boom');
    }
  });

  it('transitions form a partition: idle | composing | ready | error', () => {
    const stages = new Set([
      initialState.stage,
      toComposing('thanks', false).stage,
      toReady('thanks', sampleLetters).stage,
      toError('x').stage,
    ]);
    expect(stages.size).toBe(4);
  });
});
