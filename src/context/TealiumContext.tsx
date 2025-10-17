"use client";

import { createContext, useContext, ReactNode, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

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

// small helper to ensure we run after paint
function afterPaint(cb: () => void) {
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => setTimeout(cb, 0));
  } else {
    setTimeout(cb, 0);
  }
}

export const TealiumProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  const trackPageView = useCallback(
    (pageData: TealiumViewData) => {
      // de-dupe by path
      if (pathname === lastTrackedPath.current) {
        // console.log("Tealium view skipped: already tracked", pathname);
        return;
      }

      afterPaint(() => {
        // 1) If caller gave page_name/page_path, we DO NOT override them.
        let effectivePageName = pageData.page_name as string | undefined;
        let effectivePagePath =
          (pageData.page_path as string | undefined) ?? pathname ?? window.location.pathname;

        // 2) If caller did NOT provide page_name, try <h1 data-track-page-name> then <h1 data-attribute-page-title>, then document.title
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
          // console.log("Tealium event fired: utag.view", dataLayer);
        } else {
          console.warn("Tealium 'utag' object not found.");
        }
      });
    },
    [pathname]
  );

  const trackLink = useCallback((eventData: TealiumLinkParams) => {
    const dataLayer: TealiumLinkData = {
      event_category: "content",
      ...eventData,
    };
    if (window.utag) {
      window.utag.link(dataLayer);
      // console.log("Tealium event fired: utag.link", dataLayer);
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