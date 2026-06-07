const WINDOW_MS = 60_000;

export interface RateLimitResult {
  ok: boolean;
  count?: number;
  reason?: 'rate-limit';
  retryAfterSec?: number;
}

interface StoredWindow {
  count: number;
  windowStart: number;
}

function key(ip: string) {
  return `rl:${ip}`;
}

export async function checkAndIncrement(
  ip: string,
  kv: KVNamespace,
  max: number,
  windowSec: number
): Promise<RateLimitResult> {
  const k = key(ip);
  const raw = await kv.get(k);
  const now = Date.now();
  const windowMs = windowSec * 1000;
  let entry: StoredWindow = raw ? (JSON.parse(raw) as StoredWindow) : { count: 0, windowStart: now };
  if (now - entry.windowStart > windowMs) {
    entry = { count: 0, windowStart: now };
  }
  entry.count += 1;
  await kv.put(k, JSON.stringify(entry), { expirationTtl: windowSec + 5 });
  if (entry.count > max) {
    const retryAfterSec = Math.ceil((windowMs - (now - entry.windowStart)) / 1000);
    return { ok: false, reason: 'rate-limit', retryAfterSec, count: entry.count };
  }
  return { ok: true, count: entry.count };
}
