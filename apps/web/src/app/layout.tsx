import './globals.css';
import type { ReactNode } from 'react';
import { MailBanner } from '@/components/MailBanner';
import { ToastProvider } from '@/components/ui/toast';

export const metadata = {
  title: '嘴笨助手 (Sry)',
  description: '道歉这件难开口的事,让 AI 帮你起个稿',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: 'REPLACE_BEACON_TOKEN' })} />
      </head>
      <body className="min-h-screen bg-paper text-ink">
        <ToastProvider>
          <MailBanner />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
