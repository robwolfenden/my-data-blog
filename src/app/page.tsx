// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getAllPosts, WPost } from "../../lib/wordpress";
import { useTealium } from "../context/TealiumContext";
import { PostRow } from "../ui/PostRow";

export default function Home() {
  const [posts, setPosts] = useState<WPost[]>([]);
  const { trackPageView } = useTealium();

  useEffect(() => {
    trackPageView({ content_category: "blog-listing", page_path: "/" });
  }, [trackPageView]);

  useEffect(() => {
    (async () => setPosts(await getAllPosts()))();
  }, []);

  return (
    <>
      <h1>My Portfolio</h1>
      <p className="lede">
        I&apos;m a Vim enthusiast and tab advocate, with a preference for dark
        mode and static typing. This is where I write about tooling and web
        engineering.
      </p>

      <ul className="post-list">
        {posts.map((p) => (
          <PostRow key={p.slug} slug={p.slug} title={p.title} date={p.date} />
        ))}
      </ul>
    </>
  );
}