// src/app/layout.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import '@mantine/core/styles.css';
import './globals.css';
import Providers from './Providers';
import TealiumScript from './TealiumScript';

const dotoFont = localFont({
  src: [{ path: '../fonts/Doto-Variable.woff2', weight: '100 900', style: 'normal' }],
  display: 'swap',
  variable: '--font-doto',
  preload: true,
});

export const metadata: Metadata = {
  title: 'My Data & Analytics Blog',
  description: 'A blog about modern data and web analytics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tealiumSrc = `https://tags.tiqcdn.com/utag/${process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT}/${process.env.NEXT_PUBLIC_TEALIUM_PROFILE}/${process.env.NEXT_PUBLIC_TEALIUM_ENV}/utag.js`;

  return (
    <html lang="en" className={dotoFont.variable}>
      <head>
        {/* 1) PREVENT Tealium's auto pageview */}
        <Script id="tealium-config" strategy="beforeInteractive">
          {`
            window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
            // stop Tealium auto view; we fire views from the app
            window.utag_cfg_ovrd.noview = true;
          `}
        </Script>

        {/* Optional but nice: preconnect */}
        <link rel="preconnect" href="https://tags.tiqcdn.com" crossOrigin="" />
      </head>
      <body>
        {/* 2) LOAD utag.js and signal readiness for our provider to flush any queued calls */}
        <TealiumScript src={tealiumSrc} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}