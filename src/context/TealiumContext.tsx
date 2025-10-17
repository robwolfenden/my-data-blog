// Full and final code for: src/context/TealiumContext.tsx

"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";

/** ===== Types you were already using (kept intact) ===== */
export interface TealiumViewData {
  [key: string]: any;
}
export interface TealiumLinkData {
  event_category: "content";
  event_action: string;
  event_content: string;
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

/** ===== Config knobs ===== */
const DEBUG = process.env.NEXT_PUBLIC_TEALIUM_DEBUG === "1";
// Poll every 120ms up to 8s as a fallback if onLoad didn't fire for some reason
const POLL_MS = 120;
const MAX_WAIT_MS = 8000;

/** ===== Context ===== */
const TealiumContext = createContext<TealiumContextType | undefined>(undefined);

/** A tiny event queue so we never lose hits if Tealium isn't ready yet */
type Queued =
  | { type: "view"; payload: TealiumViewData }
  | { type: "link"; payload: TealiumLinkData };

export const TealiumProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  /** Remember the last path we tracked a "view" for, to avoid duplicates */
  const lastTrackedPath = useRef<string | null>(null);

  /** Queue and readiness refs */
  const queueRef = useRef<Queued[]>([]);
  const flushTimerRef = useRef<number | null>(null);
  const startedPollingRef = useRef(false);
  const utagReadyResolvedRef = useRef(false);

  const isUtagReady = () => typeof window !== "undefined" && !!window.utag;

  const flushQueueIfReady = useCallback(() => {
    if (!isUtagReady()) return;
    const q = queueRef.current;
    if (!q.length) return;

    if (DEBUG) console.log(`[Tealium] Flushing ${q.length} queued event(s)…`);

    // Flush in FIFO order
    while (q.length) {
      const item = q.shift()!;
      if (item.type === "view") {
        window.utag!.view(item.payload);
        if (DEBUG) console.log("Tealium event fired: utag.view", item.payload);
      } else {
        window.utag!.link(item.payload);
        if (DEBUG) console.log("Tealium event fired: utag.link", item.payload);
      }
    }
  }, []);

  /** Fallback polling (only starts once and stops once timed out or ready) */
  const ensureUtagReadyWithPolling = useCallback(() => {
    if (startedPollingRef.current || utagReadyResolvedRef.current) return;
    startedPollingRef.current = true;

    const start = Date.now();
    const tick = () => {
      if (isUtagReady()) {
        utagReadyResolvedRef.current = true;
        flushQueueIfReady();
        return;
      }
      if (Date.now() - start >= MAX_WAIT_MS) {
        if (DEBUG) console.warn("[Tealium] utag not ready after max wait.");
        return;
      }
      flushTimerRef.current = window.setTimeout(tick, POLL_MS);
    };

    flushTimerRef.current = window.setTimeout(tick, POLL_MS);
  }, [flushQueueIfReady]);

  /** Listen for the explicit "tealium:ready" signal from layout.tsx */
  useEffect(() => {
    const onReady = () => {
      utagReadyResolvedRef.current = true;
      flushQueueIfReady();
    };
    window.addEventListener("tealium:ready", onReady, { once: true });
    return () => window.removeEventListener("tealium:ready", onReady);
  }, [flushQueueIfReady]);

  /** Clean up any pending timers on unmount */
  useEffect(() => {
    return () => {
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
    };
  }, []);

  /** Helper: enqueue + try flush */
  const enqueue = (item: Queued) => {
    queueRef.current.push(item);
    // Try to flush immediately if utag is available; otherwise ensure polling
    flushQueueIfReady();
    if (!isUtagReady()) ensureUtagReadyWithPolling();
  };

  /** ===== Tracking functions ===== */

  const trackPageView = useCallback(
    (pageData: TealiumViewData) => {
      // De-dup based on current path
      if (pathname === lastTrackedPath.current) {
        if (DEBUG) console.log("[Tealium] view skipped (already tracked):", pathname);
        return;
      }

      // Build final data model *after* the H1 is in the DOM
      requestAnimationFrame(() => {
        try {
          const h1 = document.querySelector("h1");
          const h1Attr = h1?.getAttribute("data-attribute-page-title") || undefined;
          const pageTitle = h1Attr || document.title;

          // Respect caller overrides; otherwise fill with h1 + path
          const payload: TealiumViewData = {
            page_name: pageData.page_name ?? pageTitle,
            page_path: pageData.page_path ?? pathname,
            ...pageData,
          };

          if (isUtagReady()) {
            window.utag!.view(payload);
            lastTrackedPath.current = pathname;
            if (DEBUG) console.log("Tealium event fired: utag.view", payload);
          } else {
            enqueue({ type: "view", payload });
            // Only mark lastTrackedPath once we actually send, to be strict
            const markSentWhenFlushed = () => {
              lastTrackedPath.current = pathname;
              window.removeEventListener("tealium:ready", markSentWhenFlushed);
            };
            window.addEventListener("tealium:ready", markSentWhenFlushed, { once: true });
          }
        } catch (err) {
          if (DEBUG) console.warn("Tealium view failed:", err);
        }
      });
    },
    [pathname]
  );

  const trackLink = useCallback((eventData: TealiumLinkParams) => {
    const payload: TealiumLinkData = {
      event_category: "content",
      ...eventData,
    };

    try {
      if (isUtagReady()) {
        window.utag!.link(payload);
        if (DEBUG) console.log("Tealium event fired: utag.link", payload);
      } else {
        enqueue({ type: "link", payload });
      }
    } catch (err) {
      if (DEBUG) console.warn("Tealium link failed:", err);
    }
  }, []);

  return (
    <TealiumContext.Provider value={{ trackPageView, trackLink }}>
      {children}
    </TealiumContext.Provider>
  );
};

export const useTealium = () => {
  const context = useContext(TealiumContext);
  if (context === undefined) {
    throw new Error("useTealium must be used within a TealiumProvider");
  }
  return context;
};