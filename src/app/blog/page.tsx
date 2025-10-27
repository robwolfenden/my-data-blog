// src/app/blog/page.tsx
// BLOG HOME — shows all posts

import { Container, Title, Text } from '@mantine/core';
import { headers, draftMode } from 'next/headers';
import { getAllPosts } from '@/lib/wordpress';
import { PostRow } from '@/components/blog/PostRow';
import { TealiumPageView } from '@/tracking/tealium';

export const revalidate = 60;

export default async function BlogIndex() {
  const { isEnabled } = await draftMode();

  const h = await headers();
  const host = h.get('host') ?? '';
  const isLocalHost = host.startsWith('localhost') || host.startsWith('127.0.0.1');

  const includeDrafts =
    isEnabled || (process.env.SHOW_DRAFTS_LOCAL === 'true' && isLocalHost);

  const posts = await getAllPosts(includeDrafts);

  return (
    <Container fluid px={0} py="xl" className="container">
      {/* Tealium page_view */}
      <TealiumPageView
        overrides={{
          page_title: 'Blog',
          page_path: '/blog',
          content_category: 'blog-index',
          page_subcategory: 'listing',
        }}
      />

      <header>
        <Title order={1}>Blog</Title>
      </header>

      {posts.length === 0 ? (
        <Text mt="xl">No posts yet.</Text>
      ) : (
        <ul className="posts" style={{ marginTop: 'var(--mantine-spacing-xl)' }}>
          {posts.map((p) => (
            <PostRow key={p.slug} slug={p.slug} title={p.title} date={p.date} />
          ))}
        </ul>
      )}
    </Container>
  );
}