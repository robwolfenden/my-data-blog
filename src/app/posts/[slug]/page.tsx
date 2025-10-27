// src/app/posts/[slug]/page.tsx
// SINGLE POST — Mantine + Tealium preserved

import { Container, Title, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { getPostBySlug } from '@/lib/wordpress';
import { TealiumPageView } from '@/tracking/tealium';

export const revalidate = 300; // ISR for published pages

type Params = { slug: string };

// Next 15: params can be a Promise; await before using
export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  const includeDrafts = isEnabled || process.env.SHOW_DRAFTS_LOCAL === 'true';

  const post = await getPostBySlug(slug, includeDrafts);
  if (!post) notFound();

  return (
    <Container fluid px={0} py="xl" className="container">
      {/* Tealium page_view */}
      <TealiumPageView
        overrides={{
          page_title: post.title,
          page_path: `/posts/${slug}`,
          content_category: 'blog-post',
          page_subcategory: post.page_subcategory ?? 'N/A',
          publish_date: post.date,
        }}
      />

      <Anchor component={Link} href="/blog" mb="xl">
        &larr; Back to all posts
      </Anchor>

      <header>
        <Title
          order={1}
          data-track-page-name={post.title}
          data-attribute-page-title={post.title}
          fz={{ base: 28, sm: 40, lg: 56 }}
          fw={800}
          lh={1.1}
        >
          {post.title}
        </Title>

        <Text className="post-date" mt="xs">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </header>

      <article
        className="prose"
        style={{ marginTop: 'var(--mantine-spacing-xl)' }}
        dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
      />
    </Container>
  );
}