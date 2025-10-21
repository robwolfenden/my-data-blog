// src/ui/PostRow.tsx
"use client";

import Link from "next/link";
import { useTealium } from "../context/TealiumContext";

export function PostRow(props: { slug: string; title: string; date: string }) {
  const { trackLink } = useTealium();

  return (
    <li className="post">
      <time className="post-date">
        {new Date(props.date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>

      <Link
        className="post-title"
        href={`/posts/${props.slug}`}
        onClick={() =>
          trackLink({
            event_action: "onsite link",
            event_content: `post: ${props.title}`,
          })
        }
      >
        {props.title}
      </Link>
    </li>
  );
}