'use client';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import clsx from 'clsx';

type ToastKind = 'info' | 'success' | 'error';
interface Toast { id: number; kind: ToastKind; message: string; }
interface ToastApi { push: (kind: ToastKind, message: string) => void; }

const Ctx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p, { id, kind, message }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {items.map((t) => (
          <div key={t.id} className={clsx(
            'px-3 py-2 rounded text-sm shadow',
            t.kind === 'success' && 'bg-emerald-600 text-white',
            t.kind === 'error' && 'bg-rose-600 text-white',
            t.kind === 'info' && 'bg-slate-800 text-white',
          )}>{t.message}</div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('ToastProvider missing');
  return v;
}
