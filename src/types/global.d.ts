// This file declares the 'utag' object on the global Window interface.
// TypeScript will now recognize window.utag without errors.

interface Window {
  utag?: {
    view: (data: Record<string, any>) => void;
    link: (data: Record<string, any>) => void;
    // Add other utag functions like 'link' if you plan to use them
  };
}