// Full and final code for: lib/wordpress.ts (with ACF Group fix)

export type WPost = {
  title: string;
  slug: string;
  date: string;
  content?: string;
  page_subcategory?: string; // We will manually populate this for easy use
  // This represents the raw GraphQL response
  analyticsMetadata?: {
    pageSubcategory?: string;
  };
};

const API_URL = process.env.WORDPRESS_API_URL || 'http://34.88.16.249/graphql';

async function fetchAPI(query: string, { variables }: { variables?: Record<string, any> } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
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
        nodes {
          title
          slug
          date
        }
      }
    }
  `);
  return data?.posts?.nodes || [];
}

export async function getPostBySlug(slug: string): Promise<WPost> {
  const data = await fetchAPI(`
    query GetSinglePost($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        date
        content
        slug
        # 1. Query the group name from your screenshot
        analyticsMetadata {
          # 2. Query the field name, converted to camelCase
          pageSubcategory
        }
      }
    }
  `, {
    variables: { id: slug },
  });

  // 3. Process the nested data to make it easy to use in your component
  const post = data?.post;
  if (post && post.analyticsMetadata) {
    post.page_subcategory = post.analyticsMetadata.pageSubcategory;
  }
  
  return post;
}