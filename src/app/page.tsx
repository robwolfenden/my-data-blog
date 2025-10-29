// src/app/page.tsx
// HOMEPAGE — most recent 5 posts + your intro content + Tealium

import { Container, Title, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getAllPosts } from '@/lib/wordpress';
import { PostRow } from '@/components/blog/PostRow';
import { TealiumPageView } from '@/tracking/tealium';

export const revalidate = 60;

export default async function HomePage() {
  const { isEnabled } = await draftMode();
  const includeDrafts = isEnabled || process.env.SHOW_DRAFTS_LOCAL === 'true';

  const posts = await getAllPosts(includeDrafts);
  const recent = posts.slice(0, 5);

  return (
    <Container fluid px={0} py="xl" className="container">
      <TealiumPageView
        contextdata={{
          page_path: '/',
          content_category: 'home',
        }}
      />

      <header style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
        <Title
          order={1}
          fz={{ base: 28, sm: 40, lg: 56 }}
          fw={800}
          lh={1.1}
          // Source of truth for page_title:
          data-track-page-title="Hello there.."
        >
          Hello there..
        </Title>

        <Text mt="md" fz="lg">
          Welcome. I'm a senior leader with 17 years of experience in executive management and consultancy,
          focused on one core challenge: bridging the gap between complex data and the customer. My background
          isn't just in data; it's rooted in customer and user experience design, which shapes how I approach
          defining enterprise data strategy and leading agile teams.
        </Text>
        <Text mt="md" fz="lg">
          Here, I'll be sharing insights on the full data lifecycle, from capture and architecture to insight and action.
          We'll explore digital transformation, analytics, and data-driven strategies, all with the practical goal of
          optimising the customer experience and driving results.
        </Text>
      </header>

      <section style={{ marginTop: 'var(--mantine-spacing-xl)' }}>
        <Title order={2}>Recent posts</Title>
        <ul className="posts" style={{ marginTop: 'var(--mantine-spacing-md)' }}>
          {recent.map((p) => (
            <PostRow key={p.slug} slug={p.slug} title={p.title} date={p.date} />
          ))}
        </ul>

        <Anchor component={Link} href="/blog" mt="lg">
          View all posts →
        </Anchor>
      </section>
    </Container>
  );
}