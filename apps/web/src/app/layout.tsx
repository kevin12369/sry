import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/toast';
import { Footer } from '@/components/Footer';

const SITE_URL = 'https://sry-web.pages.dev';
const TITLE = 'Sry.lol / 嘴替游乐场 - 30 秒挑人设的嘴替生成器';
const DESCRIPTION =
  'Sry.lol 是一个开源 AI 嘴替游乐场:输入你闯的祸,5 种人格面具出 5 封草稿 + AI 损友点评。0 后端,0 配额,0 隐私顾虑。';
const KEYWORDS =
  '嘴替, AI 道歉, 道歉信生成, Sry, 5 风格, AI 损友, 道歉难开口, 拒绝信, 表白信, 撕逼';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: 'kevin12369' }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Sry.lol',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Sry.lol',
  alternateName: '嘴替游乐场',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Web',
  description: DESCRIPTION,
  url: SITE_URL,
  author: { '@type': 'Person', name: 'kevin12369', email: '491750329@qq.com' },
  license: 'https://opensource.org/licenses/MIT',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="author" content="kevin12369" />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content="Sry.lol" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="min-h-screen bg-paper text-ink">
        <ToastProvider>
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}