// Project-level free-tier usage tracking.
// Two KV keys: one per UTC day (resets daily), one per UTC month (resets monthly).
// Both are appended by recordUsage(neurons) on every successful /api/gen call.

export interface UsageBucket {
  cap: number;
  used: number;
  remaining: number;
  resets_at: string; // ISO 8601
}

export interface Usage {
  daily: UsageBucket;
  monthly: UsageBucket;
}

export function kvUsageKey(scope: 'daily' | 'monthly', period: string): string {
  return `sry:usage:${scope}:${period}`;
}

export function todayUtc(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export function monthUtc(now: Date): string {
  return now.toISOString().slice(0, 7);
}

export function nextDailyResetUtc(now: Date): string {
  const d = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0,
  ));
  return d.toISOString();
}

export function nextMonthlyResetUtc(now: Date): string {
  const d = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    1, 0, 0, 0, 0,
  ));
  return d.toISOString();
}

export function makeUsageBucket(cap: number, used: number, resetsAt: string): UsageBucket {
  return {
    cap,
    used,
    remaining: Math.max(0, cap - used),
    resets_at: resetsAt,
  };
}
