// src/app/blog/page.tsx
import { useEffect, useState } from 'react';
import { Container, Title, Text } from '@mantine/core';
import { getAllPosts, WPost } from '../../../lib/wordpress';
import { useTealium } from '../../context/TealiumContext';
import { PostRow } from '../../ui/PostRow';

export const revalidate = 300; // ISR: refresh list every 5 minutes (optional)

export default async function BlogPage() {
   const [posts, setPosts] = useState<WPost[]>([]);
  const { trackPageView } = useTealium();

  useEffect(() => {
    trackPageView({ content_category: 'blog-listing', page_path: '/' });
  }, [trackPageView]);

  useEffect(() => {
    (async () => setPosts(await getAllPosts()))();
  }, []);

  return (
    <Container fluid px={0} py="xl" className="container">
      <Title order={1} fz={{ base: 28, sm: 40, lg: 56 }} fw={800} lh={1.1}>
        Blog
      </Title>
      <Text className="lede" mt="sm">All posts.</Text>

      <ul className="post-list" style={{ marginTop: 'var(--mantine-spacing-xl)' }}>
        {posts.map((p: any) => (
          <PostRow key={p.slug} slug={p.slug} title={p.title} date={p.date} />
        ))}
      </ul>
    </Container>
  );
}