// Full code for: src/components/TealiumTracker.tsx

"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function TealiumTracker() {
  const pathname = usePathname();

  // DEBUG: This log will run every time the component renders.
  console.log(`TealiumTracker is RENDERING with path: ${pathname}`);

  useEffect(() => {
    // DEBUG: This log runs only after the pathname has changed.
    console.log(`TealiumTracker useEffect is FIRING for path: ${pathname}`);

    if (window.utag) {
      window.utag.view({
        pathname: pathname,
      });
    }
  }, [pathname]);

  return null;
}