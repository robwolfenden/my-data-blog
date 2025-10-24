'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTealium } from '@/context/TealiumContext';

type Vars = Record<string, unknown>;
type Options = {
  overrides?: Vars;
  findSelector?: string;      // defaults to [data-track-page-title]
  fireOncePerPath?: boolean;  // default true
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
  overrides,
  findSelector,
  fireOncePerPath = true,
}: Options = {}) {
  const pathname = usePathname();
  const { trackPageView } = useTealium();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (fireOncePerPath && lastPathRef.current === pathname) return;

    (async () => {
      const vars = { ...readPageAttrs(findSelector), ...overrides };
      if (!(await waitForUtag())) return;
      trackPageView(vars);
      lastPathRef.current = pathname;
    })();
  }, [pathname, overrides, findSelector, fireOncePerPath, trackPageView]);
}