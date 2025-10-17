// src/app/TealiumScript.tsx
"use client";
import Script from "next/script";

export default function TealiumScript({ src }: { src: string }) {
  return (
    <Script
      id="tealium-utag"
      strategy="afterInteractive"
      src={src}
      onLoad={() => {
        try { window.dispatchEvent(new Event("tealium:ready")); } catch {}
      }}
    />
  );
}