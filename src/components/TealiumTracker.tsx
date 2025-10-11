// Full code for: src/components/TealiumTracker.tsx

"use client"; // This is very important.

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Make sure the "export" keyword is here!
export function TealiumTracker() { 
  const pathname = usePathname();

  useEffect(() => {
    console.log(`Route changed to: ${pathname}. Firing Tealium view.`);

    // Check if the Tealium utag object is available on the window
    if (window.utag) {
      // Manually trigger a Tealium page view event.
      window.utag.view({
        pathname: pathname,
        // You can add other page-specific variables here, e.g., page_name
      });
    }
  }, [pathname]); // This runs the code only when the pathname changes.

  return null; // This component does not render any visible HTML.
}