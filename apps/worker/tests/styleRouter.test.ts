import { describe, it, expect, vi } from 'vitest';
import { routeOnce } from '../src/router/styleRouter.js';
import type { LLMClient } from '../src/llm/client.js';
import { STYLES } from '@sry/shared';

function fakeClient(map: Partial<Record<string, string>>, failOn?: string[]): LLMClient {
  return {
    id: 'workers-ai' as const,
    async generate({ system }) {
      // crude: identify the style by a marker phrase in the system prompt
      let key = '';
      if (system.includes('喜剧作家')) key = 'funny';
      else if (system.includes('沟通教练')) key = 'sincere';
      else if (system.includes('反向辩护')) key = 'shameless';
      else if (system.includes('法务助理')) key = 'legal-cold';
      else if (system.includes('已读不回')) key = 'silent-treatment';
      if (failOn?.includes(key)) throw new Error('boom');
      return { text: map[key] ?? `letter for ${key}`, neurons: 100 };
    },
  };
}

describe('routeOnce', () => {
  it('returns 5 keys with letters when all succeed', async () => {
    const out = await routeOnce({
      situation: '我把室友的猫放跑了',
      personality: 'direct',
      llm: fakeClient({}),
    });
    expect(Object.keys(out.letters).sort()).toEqual([...STYLES].sort());
    expect(out.neurons).toBe(STYLES.length * 100);
    for (const s of STYLES) expect(out.letters[s].length).toBeGreaterThan(0);
  });

  it('returns empty string for failed styles (UI retries)', async () => {
    const out = await routeOnce({
      situation: '我把室友的猫放跑了',
      personality: 'direct',
      llm: fakeClient({}, ['funny']),
    });
    expect(out.letters['funny']).toBe('');
    expect(out.letters['sincere'].length).toBeGreaterThan(0);
    // 4 successful styles × 100 neurons each (failed style returns 0)
    expect(out.neurons).toBe(4 * 100);
  });
});

// suppress unused
void vi;
