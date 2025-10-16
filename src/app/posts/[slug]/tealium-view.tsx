// app/posts/[slug]/tealium-view.tsx (client)
'use client';
import { useEffect } from 'react';
import { useTealium } from '../../..//context/TealiumContext';

export default function TealiumView(props: {
  title: string; slug: string; date: string; pageSubcategory: string;
}) {
  const { trackPageView } = useTealium();
  useEffect(() => {
    trackPageView({
      page_type: 'post-detail',
      post_title: props.title,
      post_slug: props.slug,
      post_publish_date: props.date,
      page_subcategory: props.pageSubcategory,
    });
  }, [trackPageView, props.title, props.slug, props.date, props.pageSubcategory]);
  return null;
}