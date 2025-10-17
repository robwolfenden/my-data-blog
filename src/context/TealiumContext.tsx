"use client";

import { createContext, useContext, ReactNode, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

export interface TealiumViewData { [key: string]: any; }
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

const TealiumContext = createContext<TealiumContextType | undefined>(undefined);

// run after the next paint
function afterPaint(cb: () => void) {
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => setTimeout(cb, 0));
  } else {
    setTimeout(cb, 0);
  }
}

// central toggle for console logging
function isDebug(): boolean {
  if (process.env.NEXT_PUBLIC_TEALIUM_DEBUG === "1") return true;
  if (typeof window !== "undefined") {
    try { return window.localStorage.getItem("tealium_debug") === "1"; } catch {}
  }
  return false;
}

export const TealiumProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  const trackPageView = useCallback((pageData: TealiumViewData) => {
    if (pathname === lastTrackedPath.current) return;

    afterPaint(() => {
      let effectivePageName = pageData.page_name as string | undefined;
      let effectivePagePath =
        (pageData.page_path as string | undefined) ??
        pathname ??
        (typeof window !== "undefined" ? window.location.pathname : "/");

      if (!effectivePageName) {
        const h1 = document.querySelector("h1");
        effectivePageName =
          h1?.getAttribute("data-track-page-name") ||
          h1?.getAttribute("data-attribute-page-title") ||
          document.title ||
          "Page";
      }

      const dataLayer: TealiumViewData = {
        ...pageData,
        page_name: effectivePageName,
        page_path: effectivePagePath,
      };

      if (window.utag) {
        window.utag.view(dataLayer);
        lastTrackedPath.current = pathname;

        if (isDebug()) {
          // pretty console
          // eslint-disable-next-line no-console
          console.groupCollapsed(
            "%cTealium view",
            "background:#0ea5e9;color:#fff;padding:2px 6px;border-radius:4px",
            new Date().toISOString()
          );
          // eslint-disable-next-line no-console
          console.log(dataLayer);
          // eslint-disable-next-line no-console
          console.groupEnd();

          // optional event hook for custom tooling
          window.dispatchEvent(new CustomEvent("tealium:view", { detail: dataLayer }));
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn("Tealium 'utag' object not found.");
      }
    });
  }, [pathname]);

  const trackLink = useCallback((eventData: TealiumLinkParams) => {
    const dataLayer: TealiumLinkData = {
      event_category: "content",
      ...eventData,
    };

    if (window.utag) {
      window.utag.link(dataLayer);

      if (isDebug()) {
        // eslint-disable-next-line no-console
        console.groupCollapsed(
          "%cTealium link",
          "background:#22c55e;color:#000;padding:2px 6px;border-radius:4px",
          new Date().toISOString()
        );
        // eslint-disable-next-line no-console
        console.log(dataLayer);
        // eslint-disable-next-line no-console
        console.groupEnd();

        window.dispatchEvent(new CustomEvent("tealium:link", { detail: dataLayer }));
      }
    } else {
      // eslint-disable-next-line no-console
      console.warn("Tealium 'utag' object not found.");
    }
  }, []);

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