import { describe, it, expect, vi } from 'vitest';
import { withMutex } from '@/router/usageMutex';

describe('withMutex', () => {
  it('serializes operations on the same key', async () => {
    const order: number[] = [];
    const op = (id: number, delay: number) => withMutex('k', async () => {
      await new Promise((r) => setTimeout(r, delay));
      order.push(id);
      return id;
    });

    const [a, b, c] = await Promise.all([op(1, 30), op(2, 10), op(3, 5)]);
    expect(a).toBe(1);
    expect(b).toBe(2);
    expect(c).toBe(3);
    // Order must be strictly increasing — never out of sequence
    expect(order).toEqual([1, 2, 3]);
  });

  it('runs different keys in parallel', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    const op = (k: string) => withMutex(k, async () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((r) => setTimeout(r, 20));
      concurrent--;
    });

    await Promise.all([op('a'), op('b'), op('c')]);
    expect(maxConcurrent).toBeGreaterThan(1);
  });

  it('does not block subsequent operations after a rejection', async () => {
    const order: string[] = [];
    const fail = withMutex('k', async () => {
      order.push('fail-start');
      throw new Error('boom');
    });
    const succeed = withMutex('k', async () => {
      order.push('succeed-start');
      return 'ok';
    });
    await expect(fail).rejects.toThrow('boom');
    expect(await succeed).toBe('ok');
    expect(order).toEqual(['fail-start', 'succeed-start']);
  });
});
