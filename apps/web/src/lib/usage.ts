export interface UsageBucket {
  cap: number;
  used: number;
  remaining: number;
  resets_at: string;
}

export interface Usage {
  daily: UsageBucket;
  monthly: UsageBucket;
}

export async function getUsage(apiBase: string): Promise<Usage> {
  const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/usage`, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  });
  if (!res.ok) throw new Error(`usage fetch failed: ${res.status}`);
  return res.json() as Promise<Usage>;
}

export function formatResetsIn(resetsAt: string, now: Date = new Date()): string {
  const ms = new Date(resetsAt).getTime() - now.getTime();
  if (ms <= 0) return '0m';
  const totalMinutes = Math.floor(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
