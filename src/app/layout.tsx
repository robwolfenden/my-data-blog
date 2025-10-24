import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@mantine/core/styles.css';
import './globals.css';
import Providers from './Providers';
import { TealiumScript } from '@/tracking/tealium';
import AppShellLayout from '@/components/layout/AppShellLayout';

const dotoFont = localFont({
  src: [{ path: '../fonts/Doto-Variable.woff2', weight: '100 900', style: 'normal' }],
  display: 'swap',
  variable: '--font-doto',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Rob Wolfenden | Data & Analytics',
  description: 'Focusing on one core challenge: bridging the gap between complex data and the customer. My background is not just in data; it is rooted in customer and user experience design, which shapes how I approach defining enterprise data strategy and leading agile teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tealiumSrc = `https://tags.tiqcdn.com/utag/${process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT}/${process.env.NEXT_PUBLIC_TEALIUM_PROFILE}/${process.env.NEXT_PUBLIC_ENV}/utag.js`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${dotoFont.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://tags.tiqcdn.com" crossOrigin="" />
        <TealiumScript src={tealiumSrc} />
            <TealiumScript />
      </head>
      <body>
        <Providers>
            <AppShellLayout>
                {children}
            </AppShellLayout>
        </Providers>
      </body>
    </html>
  );
}

