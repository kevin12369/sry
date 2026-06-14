import './globals.css';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';

export const metadata = {
  title: 'Sry.lol / 嘴替游乐场',
  description: '30 秒挑人设的嘴替游乐场。发不发随你,我们不管,也不想知道。',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-paper text-ink">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
