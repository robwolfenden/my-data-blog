'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTealium } from '@/tracking/tealium/Context';

type Vars = Record<string, unknown>;
type Options = {
  /** contextual data only; DOM attributes (data-track-*) remain the source of truth for page_title, etc. */
  contextdata?: Vars;

  /** optional override for where we read data-track-* attributes (default: [data-track-page-title]) */
  findSelector?: string;

  /** fire only once per path vs. on every render (default: true) */
  fireOncePerPath?: boolean;

  /** TEMP: backwards-compat shim (remove after migrating callers) */
  overrides?: Vars;
};

function kebabToSnake(s: string) {
  return s.replace(/-/g, '_');
}

function collect(el: Element): Vars {
  const out: Vars = {};
  for (const a of Array.from(el.attributes)) {
    if (a.name.startsWith('data-track-')) {
      out[kebabToSnake(a.name.replace('data-track-', ''))] = a.value;
    }
  }
  return out;
}

function readPageAttrs(selector = '[data-track-page-title]'): Vars {
  const el = document.querySelector(selector);
  return el ? collect(el) : {};
}

function waitForUtag(timeoutMs = 5000): Promise<boolean> {
  const start = Date.now();
  return new Promise((resolve) => {
    const id = setInterval(() => {
      const ok = typeof window?.utag?.view === 'function';
      if (ok || Date.now() - start > timeoutMs) {
        clearInterval(id);
        resolve(ok);
      }
    }, 50);
  });
}

export default function usePageViewTracker({
  contextdata,
  findSelector,
  fireOncePerPath = true,
  // TEMP shim: accept `overrides` but map it to `contextdata` if `contextdata` is not provided
  overrides,
}: Options = {}) {
  const pathname = usePathname();
  const { trackPageView } = useTealium();
  const lastPathRef = useRef<string | null>(null);

  // prefer contextdata; fall back to overrides for backwards-compat
  const ctx = contextdata ?? overrides ?? {};

  useEffect(() => {
    if (fireOncePerPath && lastPathRef.current === pathname) return;

    (async () => {
      // IMPORTANT: attributes win over contextdata (so the H1’s data-track-page-title is the source of truth)
      const vars = { ...(ctx || {}), ...readPageAttrs(findSelector) };
      if (!(await waitForUtag())) return;
      trackPageView(vars);
      lastPathRef.current = pathname;
    })();
    // include `ctx` so updates to contextdata refire
  }, [pathname, ctx, findSelector, fireOncePerPath, trackPageView]);
}