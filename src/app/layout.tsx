import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { TealiumProvider } from "../context/TealiumContext";
import TealiumScript from "./TealiumScript";
import Script from "next/script";

const dotoFont = localFont({
  // you moved the file to: src/fonts/Doto-Variable.woff2
  // layout.tsx is in src/app → one level up to src, then /fonts
  src: [
    {
      path: "../fonts/Doto-Variable.woff2",
      weight: "100 900",     // ← variable font range
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  variable: "--font-doto",
});

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "A blog about modern data and web analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tealiumSrc = `https://tags.tiqcdn.com/utag/${process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT}/${process.env.NEXT_PUBLIC_TEALIUM_PROFILE}/${process.env.NEXT_PUBLIC_TEALIUM_ENV}/utag.js`;

  return (
    <html lang="en" className={dotoFont.variable}>
      <head>
        <link rel="preconnect" href="https://tags.tiqcdn.com" crossOrigin="" />
        {/* Stop Tealium’s automatic page view */}
        <Script id="tealium-config" strategy="beforeInteractive">
          {`window.utag_cfg_ovrd = window.utag_cfg_ovrd || {}; window.utag_cfg_ovrd.noview = true;`}
        </Script>
        {/* Load Tealium and emit readiness */}
        <TealiumScript src={tealiumSrc} />
      </head>
      <body>
        <TealiumProvider>
          <MantineProvider>{children}</MantineProvider>
        </TealiumProvider>
      </body>
    </html>
  );
}