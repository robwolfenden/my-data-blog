// Full and final code for: src/app/layout.tsx

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import localFont from "next/font/local";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { TealiumProvider } from "../context/TealiumContext";

const dotoFont = localFont({
  src: "../../fonts/Doto-Variable.woff2",
  display: "swap",
  variable: "--font-doto",
});

export const metadata: Metadata = {
  title: "Coming soon",
  description: "A blog about modern data and web analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tealiumSrc = `https://tags.tiqcdn.com/utag/${process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT}/${process.env.NEXT_PUBLIC_TEALIUM_PROFILE}/${process.env.NEXT_PUBLIC_TEALIUM_ENV}/utag.js`;

  return (
    <html lang="en" className={dotoFont.variable}>
      <head>
        {/* Help the browser connect a touch earlier */}
        <link rel="preconnect" href="https://tags.tiqcdn.com" crossOrigin="" />

        {/* Tell Tealium not to auto-fire a view on load (we control it) */}
        <Script id="tealium-config" strategy="beforeInteractive">
          {`
            window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
            window.utag_cfg_ovrd.noview = true;
          `}
        </Script>

        {/* Load Tealium. When it finishes, broadcast a readiness signal */}
        <Script
          id="tealium-utag"
          strategy="afterInteractive"
          src={tealiumSrc}
          onLoad={() => {
            try {
              window.dispatchEvent(new Event("tealium:ready"));
            } catch {}
          }}
        />
      </head>
      <body>
        <TealiumProvider>
          <MantineProvider>{children}</MantineProvider>
        </TealiumProvider>
      </body>
    </html>
  );
}