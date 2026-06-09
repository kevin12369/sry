// In-memory per-key single-flight queue.
// Serializes read-modify-write operations on the same KV key so concurrent
// requests can't both pass the cap check based on the same stale value.
// Note: only serializes within a single Worker instance. Cross-instance
// races still possible (Cloudflare KV is eventually consistent and lacks CAS).
// Acceptable trade-off: quota is a soft cap; small overshoot is fine.

const chains = new Map<string, Promise<unknown>>();

export async function withMutex<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = chains.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);  // run regardless of prev outcome
  chains.set(key, next);
  try {
    return await next;
  } finally {
    // Optional cleanup: if no other waiters, drop the chain
    if (chains.get(key) === next) chains.delete(key);
  }
}
