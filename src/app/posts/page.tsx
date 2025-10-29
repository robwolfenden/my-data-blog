// src/app/blog/page.tsx
// BLOG HOME — all posts + Tealium

import { Container, Title, Text } from '@mantine/core';
import { draftMode } from 'next/headers';
import { getAllPosts } from '@/lib/wordpress';
import { PostRow } from '@/components/blog/PostRow';
import { TealiumPageView } from '@/tracking/tealium';

export const revalidate = 60;

export default async function BlogIndex() {
  const { isEnabled } = await draftMode();
  const includeDrafts = isEnabled || process.env.SHOW_DRAFTS_LOCAL === 'true';

  const posts = await getAllPosts(includeDrafts);

  return (
    <Container fluid px={0} py="xl" className="container">
      <TealiumPageView
        contextdata={{
          page_path: '/posts',
          content_category: 'post-index',
        }}
      />

      <header>
        <Title
          order={1}
          data-track-page-title="Blog"
        >
          Blog
        </Title>
      </header>

      {posts.length === 0 ? (
        <Text mt="xl">No posts yet.</Text>
      ) : (
        <ul className="posts" style={{ marginTop: 'var(--mantine-spacing-xl)'}}>
          {posts.map((p) => (
            <PostRow key={p.slug} slug={p.slug} title={p.title} date={p.date} />
          ))}
        </ul>
      )}
    </Container>
  );
}