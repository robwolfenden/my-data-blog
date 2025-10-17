// src/context/TealiumContext.tsx
"use client";

import { createContext, useContext, ReactNode, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

/** ---------- Types shared by callers ---------- */
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

const TealiumContext = createContext<TealiumContextType | undefined>(undefined);

export const TealiumProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  const trackPageView = useCallback(
    (pageData: TealiumViewData) => {
      // De-dupe same-path double fires
      if (pathname === lastTrackedPath.current) {
        console.log("Tealium view skipped: path already tracked.", pathname);
        return;
      }

      setTimeout(() => {
        const h1 = document.querySelector("h1");
        const attrName =
          h1?.getAttribute("data-track-page-name") ||
          h1?.getAttribute("data-attribute-page-title") ||
          undefined;

        // Respect caller-supplied values first; then attribute; then document.title.
        const resolvedPageName =
          pageData.page_name ?? attrName ?? document.title ?? "Page";

        const resolvedPagePath = pageData.page_path ?? pathname ?? window.location.pathname;

        const dataLayer: TealiumViewData = {
          ...pageData,
          page_name: resolvedPageName,
          page_path: resolvedPagePath,
        };

        if (window.utag) {
          // Use optional chaining to be safe
          window.utag?.view(dataLayer);
          lastTrackedPath.current = pathname;
          console.log("Tealium event fired: utag.view", dataLayer);
        } else {
          console.warn("Tealium 'utag' object not found.");
        }
      }, 0);
    },
    [pathname]
  );

  const trackLink = useCallback((eventData: TealiumLinkParams) => {
    const dataLayer: TealiumLinkData = {
      event_category: "content",
      ...eventData,
    };
    if (window.utag) {
      window.utag?.link(dataLayer);
      console.log("Tealium event fired: utag.link", dataLayer);
    } else {
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