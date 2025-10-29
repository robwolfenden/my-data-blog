'use client';
import usePageView from './usePageView';

export type TealiumAutoPageViewProps = {
  /** contextual data only (do not put page_title here) */
  contextdata?: Record<string, unknown>;

  /** TEMP: backwards-compat shim; will be mapped to contextdata */
  overrides?: Record<string, unknown>;

  findSelector?: string;
  fireOncePerPath?: boolean;
};

export default function TealiumAutoPageView(props: TealiumAutoPageViewProps) {
  // Map legacy `overrides` to `contextdata` if needed
  const contextdata = props.contextdata ?? props.overrides;
  usePageView({
    contextdata,
    findSelector: props.findSelector,
    fireOncePerPath: props.fireOncePerPath,
  });
  return null;
}