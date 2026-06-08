import './globals.css';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast.js';
import { DisclaimerBanner } from '@/components/DisclaimerBanner.js';

export const metadata = {
  title: '嘴笨助手 (Sry)',
  description: '5 种风格的道歉信生成器,1 次请求 30 秒挑一封能发的。',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: 'REPLACE_BEACON_TOKEN' })} />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <ToastProvider>
          <DisclaimerBanner />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
