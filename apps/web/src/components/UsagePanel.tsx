'use client';
import { formatResetsIn, type Usage, type UsageBucket } from '@/lib/usage';
import { Paper } from './Paper';

function pct(used: number, cap: number): number {
  if (cap <= 0) return 0;
  return Math.min(100, Math.round((used / cap) * 100));
}

function BucketRow({ label, bucket, isWarning, isExhausted }: {
  label: string;
  bucket: UsageBucket;
  isWarning: boolean;
  isExhausted: boolean;
}) {
  const usedFmt = bucket.used.toLocaleString('en-US');
  const capFmt = bucket.cap.toLocaleString('en-US');
  const remainingFmt = bucket.remaining.toLocaleString('en-US');
  return (
    <div className="space-y-1" data-usage-warning={isWarning ? 'true' : 'false'}>
      <div className="flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className={isExhausted ? 'text-seal font-semibold' : 'text-ink'}>
          {isExhausted ? '今日已用完' : `${remainingFmt} / ${capFmt}`}
        </span>
      </div>
      <div className="h-2 bg-paper rounded overflow-hidden">
        <div
          className={isWarning ? 'h-full bg-seal' : 'h-full bg-muted'}
          style={{ width: `${pct(bucket.used, bucket.cap)}%` }}
        />
      </div>
      <div className="text-xs text-muted text-right">
        已用 {usedFmt} ({pct(bucket.used, bucket.cap)}%)
      </div>
    </div>
  );
}

export function UsagePanel({
  usage, loading, error, onRetry,
}: {
  usage: Usage | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  if (loading && !usage) {
    return <p className="text-sm text-muted">正在查询…</p>;
  }
  if (error && !usage) {
    return (
      <div className="text-sm">
        <p className="text-seal">查询失败:{error}</p>
        <button onClick={onRetry} className="mt-1 text-seal hover:underline">点击重试</button>
      </div>
    );
  }
  if (!usage) return null;

  const dailyPct = pct(usage.daily.used, usage.daily.cap);
  const monthlyPct = pct(usage.monthly.used, usage.monthly.cap);
  const dailyWarning = dailyPct >= 80;
  const dailyExhausted = usage.daily.remaining === 0;
  const monthlyWarning = monthlyPct >= 80;

  return (
    <Paper padding="sm" className="space-y-4">
      <p className="text-sm font-semibold text-ink">📊 免费额度</p>
      <BucketRow label="今日" bucket={usage.daily} isWarning={dailyWarning} isExhausted={dailyExhausted} />
      <BucketRow label="本月" bucket={usage.monthly} isWarning={monthlyWarning} isExhausted={false} />
      <div className="border-t border-dashed border-[#c9a98d] pt-2 text-xs text-muted space-y-1">
        <p>ⓘ 配额跨多个项目共享</p>
        <p>下次日重置:{formatResetsIn(usage.daily.resets_at)}</p>
        <p>下次月重置:{formatResetsIn(usage.monthly.resets_at)}</p>
      </div>
    </Paper>
  );
}
