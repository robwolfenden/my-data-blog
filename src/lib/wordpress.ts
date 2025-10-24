export type WPost = {
  title: string;
  slug: string;
  date: string;
  content?: string;
  page_subcategory?: string;
  analyticsMetadata?: { pageSubcategory?: string };
};

// Use server env var on the server, and the proxy in the browser
function getApiUrl() {
  if (typeof window === 'undefined') {
    // server-side (SSR/SSG/Route Handler)
    return process.env.WP_GRAPHQL_URL!; // set in .env or Vercel
  }
  // client-side → hit our Next API route to avoid mixed content/CORS
  return '/api/graphql';
}

async function fetchAPI(
  query: string,
  { variables }: { variables?: Record<string, any> } = {}
) {
  const res = await fetch(getApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error('Failed to fetch API');
  }

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getAllPosts(): Promise<WPost[]> {
  const data = await fetchAPI(`
    query GetPosts {
      posts {
        nodes { title slug date }
      }
    }
  `);
  return data?.posts?.nodes || [];
}

export async function getPostBySlug(slug: string): Promise<WPost> {
  const data = await fetchAPI(
    `
    query GetSinglePost($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        date
        content
        slug
        analyticsMetadata {
          pageSubcategory
        }
      }
    }
  `,
    { variables: { id: slug } }
  );

  const post = data?.post;
  if (post && post.analyticsMetadata) {
    post.page_subcategory = post.analyticsMetadata.pageSubcategory;
  }
  return post;
}