// src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import localFont from "next/font/local";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { TealiumProvider } from "../context/TealiumContext";

// If your font is at src/app/fonts/Doto-Variable.woff2:
const dotoFont = localFont({
  src: "./fonts/Doto-Variable.woff2",
  display: "swap",
  variable: "--font-doto",
});

export const metadata: Metadata = {
  title: "Coming soon",
  description: "A blog about modern data and web analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dotoFont.variable}>
      <head>
        {/* PREVENT AUTOMATIC TEALIUM PAGE VIEW */}
        <Script id="tealium-config" strategy="beforeInteractive">
          {`
            window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
            window.utag_cfg_ovrd.noview = true;
          `}
        </Script>

        {/* Tealium Script using Environment Variables */}
        <Script
          id="tealium-utag"
          strategy="afterInteractive"
          src={`https://tags.tiqcdn.com/utag/${process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT}/${process.env.NEXT_PUBLIC_TEALIUM_PROFILE}/${process.env.NEXT_PUBLIC_TEALIUM_ENV}/utag.js`}
        />
      </head>
      <body>
        <TealiumProvider>
          <MantineProvider
            theme={{
              // Tell Mantine to use your font variable everywhere
              fontFamily: "var(--font-doto), sans-serif",
              headings: { fontFamily: "var(--font-doto), sans-serif" },
            }}
          >
            {children}
          </MantineProvider>
        </TealiumProvider>
      </body>
    </html>
  );
}