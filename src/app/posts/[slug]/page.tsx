// app/posts/[slug]/page.tsx (server component)
import { notFound } from 'next/navigation';
import { getPostBySlug } from '../../../../lib/wordpress';
import TealiumView from './tealium-view'; // client child

export const revalidate = 60; // ISR

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <TealiumView
        title={post.title}
        slug={post.slug}
        date={post.date}
        pageSubcategory={post.page_subcategory ?? 'N/A'}
      />
      <article>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content ?? '' }} />
      </article>
    </>
  );
}