export function ProgressSeal({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`第 ${current} 步, 共 ${total} 步`}>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          data-stamp
          className={[
            'h-2 flex-1 rounded-sm border border-[#c9a98d]',
            n < current ? 'bg-muted' : '',
            n === current ? 'bg-seal' : '',
            n > current ? 'bg-[#e8d8bf]' : '',
          ].filter(Boolean).join(' ')}
        />
      ))}
    </div>
  );
}
