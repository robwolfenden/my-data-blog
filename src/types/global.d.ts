// src/types/global.d.ts
export {};

declare global {
  interface Window {
    utag?: {
      view?: (data: Record<string, any>) => void;
      link?: (data: Record<string, any>) => void;
    };
  }
}