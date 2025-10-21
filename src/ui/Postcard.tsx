// src/app/Postcard.tsx
'use client';

import Link from 'next/link';
import { Card, Group, Title, Text, Badge, Button } from '@mantine/core';
import { useTealium } from '../context/TealiumContext';
import type { WPost } from '../../lib/wordpress';

export default function Postcard({ post }: { post: WPost }) {
  const { trackLink } = useTealium();

  const handleClick = () => {
    trackLink({
      event_action: 'onsite link',
      event_content: `post: ${post.title}`,
      post_slug: post.slug,
    });
  };

  return (
    <Card withBorder radius="md" shadow="sm" padding="lg">
      <Group justify="space-between" mb="sm">
        <Title order={3}>{post.title}</Title>
        <Badge color="brand" variant="light">
          New
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        Published on: {new Date(post.date).toLocaleString('en-GB')}
      </Text>

      <Button
        color="brand"
        component={Link}
        href={`/posts/${post.slug}`}
        onClick={handleClick}
        aria-label={`Read more: ${post.title}`}
      >
        Read more
      </Button>
    </Card>
  );
}