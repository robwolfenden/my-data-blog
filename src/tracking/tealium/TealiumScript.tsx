// src/tracking/tealium/TealiumScript.tsx
import Script from 'next/script';

type Props = {
  /** Optional explicit URL to utag.js. If omitted, it’s built from env vars */
  src?: string;
  /** Set utag_cfg_ovrd.noview so Tealium doesn't auto page-view (we control it). */
  noview?: boolean;
};

export default function TealiumScript({ src, noview = true }: Props) {
  // Build from env if src not provided
  const resolved =
    src ??
      (process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT &&
      process.env.NEXT_PUBLIC_TEALIUM_PROFILE &&
      process.env.NEXT_PUBLIC_TEALIUM_ENV
      ? `https://tags.tiqcdn.com/utag/${process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT}/${process.env.NEXT_PUBLIC_TEALIUM_PROFILE}/${process.env.NEXT_PUBLIC_TEALIUM_ENV}/utag.js`
    : '');

  return (
    <>
      {/* Ensure noview is set BEFORE utag loads */}
      {noview && (
        <Script id="tealium-noview" strategy="beforeInteractive">{`
          (function(w){ w.utag_cfg_ovrd = w.utag_cfg_ovrd || {}; w.utag_cfg_ovrd.noview = true; })(window);
        `}</Script>
      )}

      {resolved ? (
        <Script id="tealium" src={resolved} strategy="afterInteractive" />
      ) : (
        // Helpful dev warning when env vars are missing
        process.env.NODE_ENV !== 'production' && (
          <Script id="tealium-env-warn" strategy="afterInteractive">{`
            console.warn('[Tealium] Missing env vars NEXT_PUBLIC_TEALIUM_ACCOUNT / NEXT_PUBLIC_TEALIUM_PROFILE / NEXT_PUBLIC_TEALIUM_ENV, and no src prop provided. utag.js not injected.');
          `}</Script>
        )
      )}
    </>
  );
}