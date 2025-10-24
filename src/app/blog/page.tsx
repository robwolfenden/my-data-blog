// src/app/blog/page.tsx
import { Container, Title, Text } from '@mantine/core';
import { getAllPosts } from '@/lib/wordpress';
import { PostRow } from '@/components/blog/PostRow';
import { TealiumPageView } from '@/tracking/tealium';

export const revalidate = 300; // optional: rebuild this list every 5 minutes

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <Container fluid px={0} py="xl" className="container">
      {/* Tealium page-view for /blog */}
      <TealiumPageView overrides={{ page_path: '/blog', content_category: 'blog-listing', page_title: 'Blog' }} />

      <Title
        order={1}
        fz={{ base: 28, sm: 40, lg: 56 }}
        fw={200}
        lh={1.1}
        data-track-page-title="Home"
        data-track-content-category="homepage"
      >
        Blog
      </Title>
      <Text className="lede" mt="sm">All musings...</Text>

      <ul className="post-list" style={{ marginTop: 'var(--mantine-spacing-xl)' }}>
        {posts.map((p: any) => (
          <PostRow key={p.slug} slug={p.slug} title={p.title} date={p.date} />
        ))}
      </ul>
    </Container>
  );
}