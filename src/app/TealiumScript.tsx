// src/app/TealiumScript.tsx
'use client';

import { useEffect } from 'react';

type UtagFnName = 'view' | 'link';

function getDebugFlag(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const q = new URLSearchParams(window.location.search);
    if (q.has('tealium_debug')) return q.get('tealium_debug') !== '0';
    const ls = localStorage.getItem('tealium_debug');
    return ls === '1' || ls === 'true';
  } catch {
    return false;
  }
}

export default function TealiumScript({ src }: { src: string }) {
  useEffect(() => {
    // Prevent double-inject in dev/HMR
    if ((window as any).__utagScriptInjected) {
      // Still send ready in case the provider mounted later
      window.dispatchEvent(new Event('tealium:ready'));
      return;
    }

    const tag = document.createElement('script');
    tag.src = src;
    tag.async = true;
    tag.setAttribute('data-tealium', 'utag');
    document.head.appendChild(tag);
    (window as any).__utagScriptInjected = true;

    const debug = getDebugFlag();

    // Wrap utag methods without breaking their `this` context
    const patchUtag = () => {
      if (!window.utag) return;

      // keep a small registry so we don't wrap twice
      (window as any).__utagPatched = (window as any).__utagPatched || {};

      const wrap = (name: UtagFnName) => {
        const already = (window as any).__utagPatched[name];
        const orig = window.utag?.[name];
        if (already || typeof orig !== 'function') return;

        const wrapped = function (this: any, data: Record<string, any>) {
          if (debug) {
            try {
              // mirror Tealium’s own debug style but keep ours prefixed
              console.info(`[Tealium debug] utag.${name}`, data);
            } catch {}
          }
          // IMPORTANT: preserve the call-site `this`
          return (orig as Function).apply(this, [data]);
        };

        (window.utag as any)[name] = wrapped;
        (window as any).__utagPatched[name] = true;
      };

      wrap('view');
      wrap('link');
    };

    const signalReady = () => {
      // utag.js finished loading → tell the app
      window.dispatchEvent(new Event('tealium:ready'));
      // Patch once right away…
      patchUtag();
      // …and again shortly after in case utag replaces methods during init
      setTimeout(patchUtag, 200);
      setTimeout(patchUtag, 1000);
    };

    // When utag.js is loaded, announce readiness
    tag.addEventListener('load', signalReady);

    // NOTE: We intentionally do NOT remove the script in cleanup.
    // In dev/HMR or error recoveries, tearing it down can leave the app
    // without utag on subsequent renders.

    return () => {
      tag.removeEventListener('load', signalReady);
    };
  }, [src]);

  return null;
}