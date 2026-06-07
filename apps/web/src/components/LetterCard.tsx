'use client';
import { Card, CardBody, CardHeader } from './ui/card.js';
import { Button } from './ui/button.js';
import { useToast } from './ui/toast.js';
import { countChars } from '@/lib/wordCount.js';
import type { Style } from '@sry/shared';
import { Copy, RefreshCw } from 'lucide-react';

const META: Record<Style, { label: string; emoji: string }> = {
  'funny': { label: '搞笑', emoji: '😆' },
  'sincere': { label: '真诚', emoji: '🤝' },
  'shameless': { label: '厚脸皮', emoji: '😏' },
  'legal-cold': { label: '法律冷面', emoji: '⚖️' },
  'silent-treatment': { label: '已读不回', emoji: '🤐' },
};

export function LetterCard({
  style,
  body,
  loading,
  onRetry,
}: {
  style: Style;
  body: string;
  loading: boolean;
  onRetry: (s: Style) => void;
}) {
  const toast = useToast();
  const meta = META[style];
  const chars = countChars(body);

  function handleCopy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(body).then(
        () => toast.push('success', '已复制'),
        () => toast.push('error', '复制失败')
      );
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <span aria-hidden>{meta.emoji}</span>
          <span>{meta.label}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{chars} 字</span>
          {body && (
            <Button size="sm" variant="ghost" onClick={handleCopy} aria-label="复制">
              <Copy size={14} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody className="flex-1 flex flex-col">
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-4/6 bg-slate-200 rounded animate-pulse" />
          </div>
        ) : body ? (
          <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-slate-800 flex-1">
{body}
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 flex-1 text-slate-500 text-sm">
            <span>该风格生成失败</span>
            <Button size="sm" variant="outline" onClick={() => onRetry(style)}>
              <RefreshCw size={14} className="mr-1" /> 换一版
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
