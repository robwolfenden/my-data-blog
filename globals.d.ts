// Full code for: globals.d.ts

declare global {
  interface Window {
    utag?: {
      view: (data: object) => void;
      link: (data: object) => void;
    };
  }
}

// This is necessary to make the file a module.
export {};