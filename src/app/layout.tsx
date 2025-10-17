import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";

import { TealiumProvider } from "../context/TealiumContext";
import TealiumScript from "./TealiumScript";

const dotoFont = localFont({
  src: "../fonts/Doto-Variable.woff2",
  weight: "100 900",
  display: "swap",
  preload: true,
  variable: "--font-doto",
});

// Tell Mantine to use Doto everywhere (text + headings)
const theme = createTheme({
  fontFamily:
    'var(--font-doto), system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  headings: {
    fontFamily:
      'var(--font-doto), system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  },
});

export const metadata: Metadata = {
  title: "My Data & Analytics Blog",
  description: "A blog about modern data and web analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tealiumSrc = `https://tags.tiqcdn.com/utag/${process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT}/${process.env.NEXT_PUBLIC_TEALIUM_PROFILE}/${process.env.NEXT_PUBLIC_TEALIUM_ENV}/utag.js`;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://tags.tiqcdn.com" crossOrigin="" />
      </head>
      {/* expose the font: className loads it, variable provides --font-doto */}
      <body className={`${dotoFont.className} ${dotoFont.variable}`}>
        <TealiumScript src={tealiumSrc} />
        <TealiumProvider>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </TealiumProvider>
      </body>
    </html>
  );
}