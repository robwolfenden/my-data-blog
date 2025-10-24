import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@mantine/core/styles.css';
import './globals.css';
import Providers from './Providers';
import TealiumScript from './TealiumScript';
import AppShellLayout from '../ui/AppShellLayout'; // Import the new AppShellLayout

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
  const tealiumSrc = `https://tags.tiqcdn.com/utag/${process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT}/${process.env.NEXT_PUBLIC_TEALIUM_PROFILE}/${process.env.NEXT_PUBLIC_TEALIUM_ENV}/utag.js`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${dotoFont.variable}`}
    >
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

        {/* The Providers component, which should contain your MantineProvider, wraps the entire UI */}
        <Providers>
            {/* The new AppShellLayout handles the main structure */}
            <AppShellLayout>
                {children}
            </AppShellLayout>
        </Providers>
      </body>
    </html>
  );
}

