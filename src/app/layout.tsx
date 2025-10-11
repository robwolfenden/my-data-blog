import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TealiumTracker } from "../components/TealiumTracker"; // 1. Import the new component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Data & Analytics Blog",
  description: "A blog about modern data and web analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="tealium-integration"
          strategy="afterInteractive" // This loads the script after the page is usable, which is great for performance
        >
          {`
            (function(a,b,c,d){
            a='https://tags.tiqcdn.com/utag/nsdigitalltd/databoy-blog/prod/utag.js';
            b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
            a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);
            })();
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <TealiumTracker /> {/* 2. Place the component here */}
        {children}
      </body>
    </html>
  );
}