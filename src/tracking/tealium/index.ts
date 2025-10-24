// src/tracking/tealium/index.ts
export { default as TealiumScript } from './TealiumScript';
export { default as TealiumPageView } from './PageView';
export { default as useTealiumPageView } from './usePageView';

export { TealiumProvider, useTealium } from './Context';
export type { TealiumLinkParams, TealiumViewData } from './Context';