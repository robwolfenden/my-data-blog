// Full and final code for: src/app/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { getAllPosts, WPost } from '../../lib/wordpress';
import Link from 'next/link';
import { Container, Title, Text, Card, SimpleGrid, Group, Badge, Loader } from '@mantine/core';
import { useTealium } from '../context/TealiumContext';
import ContactForm from '../components/ContactForm'; // <-- CORRECTED PATH

export default function Home() {
  const [allPosts, setAllPosts] = useState<WPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackPageView, trackLink } = useTealium();

  useEffect(() => {
    trackPageView({
      page_type: 'homepage',
      content_category: 'blog-listing',
    });
  }, [trackPageView]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const posts = await getAllPosts();
      setAllPosts(posts);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handlePostLinkClick = (postTitle: string) => {
    trackLink({
        event_action: 'onsite link',
        event_content: `post: ${postTitle}`,
    });
  }

  if (loading) {
    return <Container size="md" py="xl" style={{ display: 'flex', justifyContent: 'center' }}><Loader /></Container>;
  }

  return (
    <Container size="md" py="xl">
      <Title order={1} data-attribute-page-title="Blog Homepage">
        My Data & Analytics Blog
      </Title>
      <Text c="dimmed" mt="md">
        Welcome to my headless blog powered by Next.js and WordPress.
      </Text>

      <Title order={2} mt={50} mb="lg">Latest Posts</Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {allPosts.map((post) => (
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            component={Link}
            href={`/posts/${post.slug}`}
            key={post.slug}
            onClick={() => handlePostLinkClick(post.title)}
          >
            <Group justify="space-between" mt="md" mb="xs">
              <Title order={3} size="h3">{post.title}</Title>
              <Badge color="blue" variant="light">
                New
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Published on: {new Date(post.date).toLocaleString('en-GB')}
            </Text>
          </Card>
        ))}
      </SimpleGrid>

      <ContactForm />

    </Container>
  );
}