import { Container, Title, Text, Paper, Anchor } from '@mantine/core';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '../../../../lib/wordpress';
import TealiumView from './tealium-view';

// NOTE: params is a Promise in Next.js 15 Server Components
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ must await before using

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <Container size="md" py="xl" className="shell narrow">
      <Anchor component={Link} href="/" mb="xl">
        &larr; Back to all posts
      </Anchor>

      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title
          order={1}
          data-track-page-name={post.title}
          data-attribute-page-title={post.title}
        >
          {post.title}
        </Title>

        <Text c="dimmed" mt="md">
          Published on: {new Date(post.date).toLocaleString('en-GB')}
        </Text>

        <hr style={{ margin: '2rem 0' }} />

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content! }}
        />
      </Paper>

      {/* fires the Tealium page_view on the client */}
      <TealiumView
        title={post.title}
        slug={post.slug}
        date={post.date}
        pageSubcategory={post.page_subcategory ?? 'N/A'}
      />
    </Container>
  );
}