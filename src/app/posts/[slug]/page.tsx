// app/posts/[slug]/page.tsx
import { Container, Title, Text, Paper, Anchor } from '@mantine/core';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '../../../../lib/wordpress';
import TealiumView from './tealium-view';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <Container size="md" py="xl">
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