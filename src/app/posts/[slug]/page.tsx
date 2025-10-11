// Full code for: src/app/posts/[slug]/page.tsx

import { getPostBySlug } from "../../../../lib/wordpress";
import Link from "next/link";

// This is the template for a single post page
export default async function Post({ params }: { params: { slug: string } }) {  // params.slug will be the slug from the URL
  const post = await getPostBySlug(params.slug);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="w-full max-w-4xl">
        {/* Back to Home link */}
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to all posts
        </Link>
        
        {/* Post Title */}
        <h1 className="text-4xl font-bold mt-4">{post.title}</h1>

        {/* Post Metadata */}
        <p className="text-gray-500 my-2">
          Published on: {new Date(post.date).toLocaleDateString()}
        </p>

        <hr />
        
        {/* Post Content */}
        {/* WordPress content is HTML, so we use dangerouslySetInnerHTML */}
        <div 
          className="prose lg:prose-xl mt-8" // `prose` classes are for styling blog content
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </main>
  );
}