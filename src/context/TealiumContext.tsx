"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { usePathname } from "next/navigation";

/* ---------- types ---------- */
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

/* ---------- utag helpers (solve TS “possibly undefined”) ---------- */
type ViewFn = (data: Record<string, any>) => void;
type LinkFn = (data: Record<string, any>) => void;
type Utag = { view?: ViewFn; link?: LinkFn };

const getUtag = (): Utag | undefined =>
  typeof window === "undefined" ? undefined : (window as any).utag;

const hasUtag = (u?: Utag): u is { view: ViewFn; link: LinkFn } =>
  !!u && typeof u.view === "function" && typeof u.link === "function";

/* ---------- debug switch ---------- */
const isDebug = () =>
  process.env.NEXT_PUBLIC_TEALIUM_DEBUG === "1" ||
  (typeof window !== "undefined" &&
    (localStorage.getItem("tealium_debug") === "1" ||
      /(?:^|[?&])tealdebug=1(?:&|$)/.test(window.location.search)));

const log = (...args: any[]) => {
  if (isDebug()) console.log(...args);
};

/* ---------- context ---------- */
const TealiumContext = createContext<TealiumContextType | undefined>(undefined);

export const TealiumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const isReadyRef = useRef(false);
  const startedPollRef = useRef(false);
  const viewQueue = useRef<TealiumViewData[]>([]);
  const linkQueue = useRef<TealiumLinkParams[]>([]);

  /* flush queues once utag is ready */
  const flushQueues = useCallback(() => {
    const utag = getUtag();
    if (!isReadyRef.current || !hasUtag(utag)) return;

    let v: TealiumViewData | undefined;
    while ((v = viewQueue.current.shift())) {
      utag.view(v);
      lastTrackedPath.current = pathname;
      log("Tealium event fired: utag.view", v);
    }

    let l: TealiumLinkParams | undefined;
    while ((l = linkQueue.current.shift())) {
      utag.link(l);
      log("Tealium event fired: utag.link", l);
    }
  }, [pathname]);

  /* public API */
  const trackPageView = useCallback(
    (pageData: TealiumViewData) => {
      if (pathname === lastTrackedPath.current) {
        log("Tealium view skipped: duplicate path", pathname);
        return;
      }

      const h1 =
        typeof document !== "undefined" ? document.querySelector("h1") : null;
      const pageTitle =
        h1?.getAttribute("data-attribute-page-title") ?? document?.title;

      const payload: TealiumViewData = {
        page_name: pageData.page_name ?? pageTitle,
        page_path: pageData.page_path ?? pathname,
        ...pageData,
      };

      const utag = getUtag();
      if (hasUtag(utag)) {
        utag.view(payload);
        lastTrackedPath.current = pathname;
        log("Tealium event fired: utag.view", payload);
      } else {
        viewQueue.current.push(payload);
        log("Tealium queued view", payload);
      }
    },
    [pathname]
  );

  const trackLink = useCallback((eventData: TealiumLinkParams) => {
    const payload: TealiumLinkParams = { event_category: "content", ...eventData };
    const utag = getUtag();
    if (hasUtag(utag)) {
      utag.link(payload);
      log("Tealium event fired: utag.link", payload);
    } else {
      linkQueue.current.push(payload);
      log("Tealium queued link", payload);
    }
  }, []);

  /* listen for the custom ‘tealium:ready’ event from the loader */
  useEffect(() => {
    const onReady = () => {
      isReadyRef.current = true;
      flushQueues();
    };
    window.addEventListener("tealium:ready", onReady);
    return () => window.removeEventListener("tealium:ready", onReady);
  }, [flushQueues]);

  /* fallback polling in case the event is missed */
  useEffect(() => {
    if (isReadyRef.current || startedPollRef.current) return;
    startedPollRef.current = true;

    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      const utag = getUtag();
      if (hasUtag(utag)) {
        isReadyRef.current = true;
        clearInterval(timer);
        flushQueues();
        return;
      }
      if (tries > 40) {
        clearInterval(timer);
        log("Tealium 'utag' not detected after waiting.");
      }
    }, 150);

    return () => clearInterval(timer);
  }, [flushQueues]);

  return (
    <TealiumContext.Provider value={{ trackPageView, trackLink }}>
      {children}
    </TealiumContext.Provider>
  );
};

export const useTealium = () => {
  const ctx = useContext(TealiumContext);
  if (!ctx) throw new Error("useTealium must be used within a TealiumProvider");
  return ctx;
};