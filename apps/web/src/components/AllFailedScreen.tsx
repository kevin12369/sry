import { Button } from './ui/button.js';
import { RefreshCw } from 'lucide-react';

export function AllFailedScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
      <h2 className="text-2xl font-semibold text-slate-800">服务暂时不可用</h2>
      <p className="text-sm text-slate-500">5 分钟后重试</p>
      <Button onClick={onRetry}>
        <RefreshCw size={14} className="mr-1" /> 5 分钟后重试
      </Button>
    </div>
  );
}
