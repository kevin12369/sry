import { Paper } from './Paper';

export function AllFailedScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <Paper padding="lg" className="max-w-md mx-auto text-center space-y-4">
      <div className="text-4xl">😶‍🌫️</div>
      <h2 className="text-lg font-semibold text-seal">服务暂时不可用</h2>
      <p className="text-sm text-muted">5 分钟后重试</p>
      <button
        onClick={onRetry}
        className="bg-ink text-cream px-5 py-2 rounded hover:bg-dark transition-colors"
      >
        ↻ 5 分钟后重试
      </button>
    </Paper>
  );
}
