// Full and final code for: src/context/TealiumContext.tsx

"use client";

import { createContext, useContext, ReactNode, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

// ... (Interface definitions remain the same)
export interface TealiumViewData {
  [key: string]: any;
}
export interface TealiumLinkData {
    event_category: 'content';
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
  // This ref will now live in the context to track the last sent page view path.
  const lastTrackedPath = useRef<string | null>(null);

  const trackPageView = useCallback((pageData: TealiumViewData) => {
    // CENTRAL GUARD: If the current path is the same as the last one we tracked, stop.
    // On navigation, a new trackPageView function is created with the new pathname, resetting this check.
    if (pathname === lastTrackedPath.current) {
      console.log("Tealium view skipped: path already tracked.", pathname);
      return;
    }

    setTimeout(() => {
      const h1 = document.querySelector('h1');
      const pageTitle = h1?.getAttribute('data-attribute-page-title') || document.title;
      
      const dataLayer: TealiumViewData = {
        ...pageData,
        page_name: pageTitle,
        page_path: pathname,
      };

      if (window.utag) {
        window.utag.view(dataLayer);
        // IMPORTANT: Update the ref only AFTER the tag has fired successfully.
        lastTrackedPath.current = pathname;
        console.log("Tealium event fired: utag.view", dataLayer);
      } else {
        console.warn("Tealium 'utag' object not found.");
      }
    }, 0);
  }, [pathname]); // The dependency on pathname is crucial here

  const trackLink = useCallback((eventData: TealiumLinkParams) => {
      const dataLayer: TealiumLinkData = {
          event_category: 'content',
          ...eventData,
      };
      if (window.utag) {
          window.utag.link(dataLayer);
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
  const context = useContext(TealiumContext);
  if (context === undefined) {
    throw new Error('useTealium must be used within a TealiumProvider');
  }
  return context;
};

