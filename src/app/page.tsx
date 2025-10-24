// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Text } from '@mantine/core';
import { getAllPosts, WPost } from '@/lib/wordpress';
import { PostRow } from '@/components/blog/PostRow';
import { TealiumPageView } from '@/tracking/tealium';

export default function Home() {
  const [posts, setPosts] = useState<WPost[]>([]);

  useEffect(() => {
    (async () => setPosts(await getAllPosts()))();
  }, []);

  return (
    <Container fluid px={0} py="xl" className="container">
      <Title
        order={1}
        fz={{ base: 28, sm: 40, lg: 56 }}
        fw={200}
        lh={1.1}
        data-track-page-title="Home"
        data-track-content-category="homepage"
      >
        Hello there..
      </Title>

      {/* Unified Tealium page view (reads the data-track-* above) */}
      <TealiumPageView overrides={{ page_path: '/' }} />
      <Text className="lede" mt="sm">
        Welcome. I'm a senior leader with 17 years of experience in executive management and consultancy, 
        focused on one core challenge: bridging the gap between complex data and the customer. 
        My background isn't just in data; it's rooted in customer and user experience design, 
        which shapes how I approach defining enterprise data strategy and leading agile teams. 
      </Text>
      <Text className="lede" mt="sm">
        Here, I'll be sharing insights on the full data lifecycle, 
        from capture and architecture to insight and action. 
        We'll explore digital transformation, analytics, and data-driven strategies, 
        all with the practical goal of optimising the customer experience and driving results.
      </Text>

      <ul className="post-list" style={{ marginTop: 'var(--mantine-spacing-xl)' }}>
        {posts.map((p) => (
          <PostRow key={p.slug} slug={p.slug} title={p.title} date={p.date} />
        ))}
      </ul>
    </Container>
  );
}