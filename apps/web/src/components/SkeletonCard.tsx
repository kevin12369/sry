import { Card, CardBody, CardHeader } from './ui/card.js';

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          <div data-testid="skeleton-line" className="h-3 w-full bg-slate-200 rounded animate-pulse" />
          <div data-testid="skeleton-line" className="h-3 w-5/6 bg-slate-200 rounded animate-pulse" />
          <div data-testid="skeleton-line" className="h-3 w-4/6 bg-slate-200 rounded animate-pulse" />
        </div>
      </CardBody>
    </Card>
  );
}
