// src/app/blog/TealiumClient.tsx
'use client';

import { useEffect } from 'react';
import { useTealium } from '../../context/TealiumContext';

export default function TealiumClient({ path = '/blog' }: { path?: string }) {
  const { trackPageView } = useTealium();

  useEffect(() => {
    trackPageView({ content_category: 'blog-listing', page_path: path });
  }, [trackPageView, path]);

  return null;
}