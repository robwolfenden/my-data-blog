// Full code for: src/app/page.tsx

import { getAllPosts } from '../../lib/wordpress'; // <-- THIS IS THE CORRECTED LINE
import Link from 'next/link';

// This is a good practice in TypeScript to define the shape of our data
type Post = {
  title: string;
  slug: string;
  date: string;
};

// The Home component is an 'async' function to allow data fetching
export default async function Home() {
  const allPosts: Post[] = await getAllPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl font-extrabold tracking-tight">My Data & Analytics Blog</h1>
        <p className="mt-2 text-lg text-gray-600">Welcome to my headless blog powered by Next.js and WordPress.</p>
        <hr className="my-8" />
        
        <h2 className="text-3xl font-bold">Latest Posts</h2>
        <div className="mt-4 space-y-4">
          {allPosts.map((post) => (
            // Each post is now a clickable Link component
            <Link href={`/posts/${post.slug}`} key={post.slug} className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="text-xl font-bold text-blue-600">{post.title}</h3>
              <small className="text-gray-500">
                Published on: {new Date(post.date).toLocaleDateString()}
              </small>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}