import type { Metadata, Viewport } from 'next';
import { Ovo } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Footer from './_components/footer';
import { ThemeScript } from './_components/theme-switcher';
import { PostHogProvider } from './providers';
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from '@/lib/constants';
import './globals.css';
import './highlight.css';

const ovo = Ovo({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-ovo',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EEEAE3' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
      'text/plain': '/llms.txt',
    },
  },
  // No `images` key here on purpose: that is what lets the opengraph-image.png
  // file convention supply the default card for every route. No title/description
  // either, so each page's own values flow into og: rather than being shadowed.
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${ovo.variable} scroll-smooth motion-reduce:scroll-auto`}
    >
      <body className={'bg-light dark:bg-slate-900 dark:text-slate-200'}>
        <PostHogProvider>
          <ThemeScript />
          <div className='flex min-h-screen flex-col'>
            <div className='flex-1'>{children}</div>
            <Footer />
          </div>
        </PostHogProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
