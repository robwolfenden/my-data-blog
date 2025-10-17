// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import { TealiumProvider } from "../context/TealiumContext";
import TealiumScript from "./TealiumScript"; // your helper component

// Font file lives at: src/fonts/Doto-Variable.woff2
const dotoFont = localFont({
  src: "../fonts/Doto-Variable.woff2",
  weight: "100 900",   // variable font range
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
    <html lang="en">
      <head>
        {/* helps establish early connection for utag */}
        <link rel="preconnect" href="https://tags.tiqcdn.com" crossOrigin="" />
      </head>

      {/* ✅ Apply BOTH the generated class AND the CSS variable to BODY */}
      <body className={`${dotoFont.className} ${dotoFont.variable}`}>
        {/* Loads utag and dispatches "tealium:ready" (your component) */}
        <TealiumScript src={tealiumSrc} />

        <TealiumProvider>
          <MantineProvider>{children}</MantineProvider>
        </TealiumProvider>
      </body>
    </html>
  );
}