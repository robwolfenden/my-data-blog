// src/context/TealiumContext.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { usePathname } from "next/navigation";

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

// console debug toggle: set NEXT_PUBLIC_TEALIUM_DEBUG=1
const DEBUG = process.env.NEXT_PUBLIC_TEALIUM_DEBUG === "1";
const log = (...args: any[]) => DEBUG && console.log(...args);

export const TealiumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  // queues while utag loads
  const viewQueue = useRef<TealiumViewData[]>([]);
  const linkQueue = useRef<TealiumLinkParams[]>([]);
  const isReadyRef = useRef(false);
  const startedWaitRef = useRef(false);

  const flushQueues = useCallback(() => {
    if (!isReadyRef.current || typeof window === "undefined" || !window.utag)
      return;

    let v: TealiumViewData | undefined;
    while ((v = viewQueue.current.shift())) {
      window.utag.view!(v);
      lastTrackedPath.current = pathname;
      log("Tealium event fired: utag.view", v);
    }

    let l: TealiumLinkParams | undefined;
    while ((l = linkQueue.current.shift())) {
      window.utag.link!(l);
      log("Tealium event fired: utag.link", l);
    }
  }, [pathname]);

  const trackPageView = useCallback(
    (pageData: TealiumViewData) => {
      // de-dupe per path
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

      const ready =
        typeof window !== "undefined" &&
        !!window.utag &&
        typeof window.utag.view === "function";

      if (ready) {
        window.utag!.view!(payload);
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
    const payload: TealiumLinkParams = {
      event_category: "content",
      ...eventData,
    };

    const ready =
      typeof window !== "undefined" &&
      !!window.utag &&
      typeof window.utag.link === "function";

    if (ready) {
      window.utag!.link!(payload);
      log("Tealium event fired: utag.link", payload);
    } else {
      linkQueue.current.push(payload);
      log("Tealium queued link", payload);
    }
  }, []);

  // dispatch from <TealiumScript/> onload
  useEffect(() => {
    const onReady = () => {
      isReadyRef.current = true;
      flushQueues();
    };
    window.addEventListener("tealium:ready", onReady);
    return () => window.removeEventListener("tealium:ready", onReady);
  }, [flushQueues]);

  // fallback poll (TS-safe)
  useEffect(() => {
    if (isReadyRef.current || startedWaitRef.current) return;
    startedWaitRef.current = true;

    let tries = 0;
    const timer = setInterval(() => {
      tries++;

      const hasUtag =
        typeof window !== "undefined" &&
        !!window.utag &&
        typeof window.utag.view === "function" &&
        typeof window.utag.link === "function";

      if (hasUtag) {
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