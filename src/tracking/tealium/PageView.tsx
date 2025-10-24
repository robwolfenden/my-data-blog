'use client';
import usePageView from './usePageView';

export type TealiumAutoPageViewProps = {
  overrides?: Record<string, unknown>;
  findSelector?: string;
  fireOncePerPath?: boolean;
};

export default function TealiumAutoPageView(props: TealiumAutoPageViewProps) {
  usePageView(props);
  return null;
}