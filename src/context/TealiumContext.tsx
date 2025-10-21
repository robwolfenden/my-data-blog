'use client';

import {
  createContext,
  useCallback,
  useContext,
  ReactNode,
  useRef,
  useEffect,
} from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    utag?: {
      view?: (data: Record<string, any>) => void;
      link?: (data: Record<string, any>) => void;
    };
  }
}

export interface TealiumViewData {
  [key: string]: any;
}
export interface TealiumLinkParams {
  event_action: string;
  event_content: string;
  [key: string]: any;
}
interface TealiumContextType {
  trackPageView: (pageData: TealiumViewData) => void;
  trackLink: (eventData: TealiumLinkParams) => void;
}

const TealiumContext = createContext<TealiumContextType | undefined>(undefined);

/** run after 2 rAFs and a tiny timeout for a stable layout */
function afterNextPaintStable(cb: () => void, delay = 150) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(cb, delay);
    });
  });
}

/** wait until the *first* load is fully stable: load -> visible -> 2 rAFs -> 150ms */
function waitForFirstStableTick(cb: () => void) {
  const go = () => {
    if (document.visibilityState === 'visible') {
      afterNextPaintStable(cb);
    } else {
      const onVis = () => {
        document.removeEventListener('visibilitychange', onVis);
        afterNextPaintStable(cb);
      };
      document.addEventListener('visibilitychange', onVis, { once: true });
    }
  };

  if (document.readyState === 'complete') {
    go();
  } else {
    window.addEventListener('load', go, { once: true });
  }
}

/** schedule softly in dev, immediately in prod */
function schedule(fn: () => void) {
  if (process.env.NODE_ENV !== 'production') {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(fn, { timeout: 600 });
    } else {
      setTimeout(fn, 120);
    }
  } else {
    setTimeout(fn, 0);
  }
}

export const TealiumProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const lastPath = useRef<string | null>(null);
  const firstViewPending = useRef(true);

  const queue = useRef<Array<{ type: 'view' | 'link'; payload: any }>>([]);

  const flush = useCallback(() => {
    if (!window.utag) return;
    const items = queue.current.splice(0);
    for (const e of items) {
      if (e.type === 'view') window.utag.view?.(e.payload);
      else window.utag.link?.(e.payload);
    }
  }, []);

  // Flush on pagehide to minimize “canceled” on nav
  useEffect(() => {
    const onHide = () => flush();
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, [flush]);

  // When Tealium announces readiness
  useEffect(() => {
    const onReady = () => flush();
    window.addEventListener('tealium:ready', onReady);
    return () => window.removeEventListener('tealium:ready', onReady);
  }, [flush]);

  const sendView = useCallback((payload: any) => {
    if (window.utag?.view) window.utag.view(payload);
    else queue.current.push({ type: 'view', payload });
  }, []);

  const sendLink = useCallback((payload: any) => {
    if (window.utag?.link) window.utag.link(payload);
    else queue.current.push({ type: 'link', payload });
  }, []);

  const trackPageView = useCallback(
    (pageData: TealiumViewData) => {
      // de-dupe per path
      if (pathname === lastPath.current) return;

      // Pull defaults from DOM
      const h1 =
        typeof document !== 'undefined'
          ? document.querySelector('h1')
          : null;
      const pageTitle =
        h1?.getAttribute('data-attribute-page-title') || document.title;

      const payload: TealiumViewData = {
        ...pageData,
        page_name: pageData.page_name ?? pageTitle,
        page_path: pageData.page_path ?? pathname,
      };

      lastPath.current = pathname;

      const fire = () => schedule(() => sendView(payload));

      if (firstViewPending.current) {
        firstViewPending.current = false;
        // delay only this very first view until page is fully stable
        waitForFirstStableTick(fire);
      } else {
        // SPA views can go out immediately
        fire();
      }
    },
    [pathname, sendView]
  );

  const trackLink = useCallback(
    (eventData: TealiumLinkParams) => {
      sendLink({ event_category: 'content', ...eventData });
    },
    [sendLink]
  );

  return (
    <TealiumContext.Provider value={{ trackPageView, trackLink }}>
      {children}
    </TealiumContext.Provider>
  );
};

export const useTealium = () => {
  const ctx = useContext(TealiumContext);
  if (!ctx) throw new Error('useTealium must be used within a TealiumProvider');
  return ctx;
};