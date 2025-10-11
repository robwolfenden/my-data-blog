import { getAllPosts } from '../../lib/wordpress'; // Note the path is now ../../

// This is a good practice in TypeScript to define the shape of our data
type Post = {
  title: string;
  slug: string;
  date: string;
};

// The Home component is now an 'async' function
export default async function Home() {
  // We fetch the data directly here instead of in a separate function
  const allPosts: Post[] = await getAllPosts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>My Data & Analytics Blog</h1>
        <p>Welcome to my headless blog powered by Next.js and WordPress.</p>
        <hr className="my-4"/>
        <h2>Latest Posts</h2>
        
        {allPosts.map((post) => (
          <div key={post.slug} className="my-2">
            <h3 className="text-xl font-bold">{post.title}</h3>
            <small>Published on: {new Date(post.date).toLocaleDateString()}</small>
          </div>
        ))}

      </div>
    </main>
  );
}