'use client';

import usePageViewTracker from './usePageViewTracker';

export type TealiumAutoPageViewProps = {
  overrides?: Record<string, unknown>;
  findSelector?: string;
  fireOncePerPath?: boolean;
};

export default function TealiumAutoPageView(props: TealiumAutoPageViewProps) {
  usePageViewTracker(props);
  return null;
}