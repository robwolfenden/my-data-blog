// Full and final code for: src/app/posts/[slug]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getPostBySlug, WPost } from "../../../../lib/wordpress";
import Link from "next/link";
import { notFound, useParams } from 'next/navigation';
import { Container, Title, Text, Paper, Loader, Anchor } from '@mantine/core';
import { useTealium } from "../../../context/TealiumContext";

export default function Post() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const [post, setPost] = useState<WPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { trackPageView } = useTealium();

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true);
      const postData = await getPostBySlug(slug);
      setPost(postData);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      trackPageView({
        page_type: 'post-detail',
        post_title: post.title,
        post_slug: post.slug,
        post_publish_date: post.date,
        page_subcategory: post.page_subcategory ?? 'N/A', 
      });
    }
  }, [post, trackPageView]);

  if (loading) {
    return <Container size="md" py="xl" style={{ textAlign: 'center' }}><Loader /></Container>;
  }

  if (!post) {
    return notFound();
  }

  return (
    <Container size="md" py="xl">
      <Anchor component={Link} href="/" mb="xl">
        &larr; Back to all posts
      </Anchor>
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title order={1} data-attribute-page-title={post.title}>{post.title}</Title>
        <Text c="dimmed" mt="md">
          Published on: {new Date(post.date).toLocaleString('en-GB')}
        </Text>
        <hr style={{ margin: '2rem 0' }} />
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content! }}
        />
      </Paper>
    </Container>
  );
}