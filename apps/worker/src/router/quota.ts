export type Mode = 'self' | 'byok' | 'hybrid';

export interface Caps {
  mode: Mode;
  daily_cap: number;
  monthly_cap: number;
  byok_enabled: boolean;
}

export interface Usage {
  workers_ai: number;
  gemini: number;
  deepseek: number;
  byok: number;
  local: number;
  requests: number;
}

export const defaultCaps: Caps = {
  mode: 'self',
  daily_cap: 0,
  monthly_cap: 0,
  byok_enabled: false,
};

export const FREE_DAILY = {
  workers_ai: 10_000,
  gemini: 1_500,
} as const;

export type QuotaResult =
  | { ok: true }
  | { ok: false; reason: 'quota-exceeded'; message: string };

const TTL = {
  daily: 7 * 24 * 60 * 60,
  monthly: 35 * 24 * 60 * 60,
};

function todayKey(ipHash: string) { return `usage:${ipHash}:${new Date().toISOString().slice(0, 10)}`; }
function monthKey(ipHash: string) { return `usage:${ipHash}:${new Date().toISOString().slice(0, 7)}`; }
function capKey(ipHash: string) { return `cap:${ipHash}`; }

function emptyUsage(): Usage {
  return { workers_ai: 0, gemini: 0, deepseek: 0, byok: 0, local: 0, requests: 0 };
}

export async function preCheck(ipHash: string, mode: Mode, kv: KVNamespace): Promise<QuotaResult> {
  const caps = (await kv.get(capKey(ipHash)).then((v) => (v ? (JSON.parse(v) as Caps) : defaultCaps)));
  const daily = (await kv.get(todayKey(ipHash)).then((v) => (v ? (JSON.parse(v) as Usage) : emptyUsage())));

  if (mode === 'self' || (mode === 'hybrid' && !caps.byok_enabled)) {
    if (daily.workers_ai >= FREE_DAILY.workers_ai && daily.gemini >= FREE_DAILY.gemini) {
      return { ok: false, reason: 'quota-exceeded', message: '今日免费额度已用完' };
    }
  }
  if (mode === 'byok' && caps.daily_cap > 0 && daily.requests >= caps.daily_cap) {
    return { ok: false, reason: 'quota-exceeded', message: `你设的日上限 ${caps.daily_cap} 已达` };
  }
  return { ok: true };
}

export async function recordUsage(
  ipHash: string,
  provider: 'workers_ai' | 'gemini' | 'deepseek' | 'byok' | 'local',
  kv: KVNamespace
): Promise<void> {
  const today = (await kv.get(todayKey(ipHash)).then((v) => (v ? (JSON.parse(v) as Usage) : emptyUsage())));
  today[provider] += 1;
  today.requests += 1;
  await kv.put(todayKey(ipHash), JSON.stringify(today), { expirationTtl: TTL.daily });

  const month = (await kv.get(monthKey(ipHash)).then((v) => (v ? (JSON.parse(v) as Usage) : emptyUsage())));
  month[provider] += 1;
  month.requests += 1;
  await kv.put(monthKey(ipHash), JSON.stringify(month), { expirationTtl: TTL.monthly });
}

// Returns true if accepting this request would put us at/over the project cap.
// Cap of 0 means "unlimited" (defensive default).
export function wouldExceedProjectCap(cap: number, currentUsed: number, estimated: number): boolean {
  if (cap <= 0) return false;
  return currentUsed + estimated >= cap;
}
