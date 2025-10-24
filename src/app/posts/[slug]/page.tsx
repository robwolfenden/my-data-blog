import { Container, Title, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '../../../../lib/wordpress';
import TealiumAutoPageView from '@/tealium/TealiumAutoPageView';

export const revalidate = 300; // optional ISR

// Next.js 15: params is a Promise
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <Container fluid px={0} py="xl" className="container">
      {/* Tealium page_view (unchanged) */}
      <TealiumAutoPageView
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
        dangerouslySetInnerHTML={{ __html: post.content! }}
      />
    </Container>
  );
}