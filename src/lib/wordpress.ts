// src/lib/wordpress.ts

export type WPost = {
  title: string;
  slug: string;
  date: string;
  content?: string;
  page_subcategory?: string;
  analyticsMetadata?: { pageSubcategory?: string };
  status?: string;
};

const WP_URL = process.env.WP_GRAPHQL_URL!;
const IS_LOCAL =
  process.env.NODE_ENV !== 'production' &&
  process.env.SHOW_DRAFTS_LOCAL === 'true';

// Build server-only auth header (used when fetching drafts)
function authHeader(): Record<string, string> {
  const u = process.env.WP_USER;
  const p = process.env.WP_APP_PW;
  if (!u || !p) return {};
  const token = Buffer.from(`${u}:${p}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

// Use server env var on the server, and the proxy in the browser
function getApiUrl() {
  if (typeof window === 'undefined') {
    // server-side (SSR/SSG/Route Handler)
    return WP_URL;
  }
  // client-side → hit our Next API route so creds never reach the browser
  return '/api/graphql';
}

async function fetchAPI(
  query: string,
  opts: { variables?: Record<string, any>; asPreview?: boolean } = {}
) {
  const { variables, asPreview = false } = opts;

  // Only need auth when we intend to read drafts (local dev or preview mode)
  const needsAuth = IS_LOCAL || asPreview;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  // Attach auth only on the server; the client uses /api/graphql which adds auth server-side.
  if (typeof window === 'undefined' && needsAuth) {
    Object.assign(headers, authHeader());
  }

  const res = await fetch(getApiUrl(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    // never cache draft responses
    cache: needsAuth ? 'no-store' : 'force-cache',
    next: needsAuth ? undefined : { revalidate: 60 },
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

// ---- Public API -------------------------------------------------------------

// Helper to fetch by a single status (WPGraphQL commonly supports `status`, not `statusIn`)
async function fetchPostsByStatus(
  status?: 'PUBLISH' | 'DRAFT',
  asPreview = false
): Promise<WPost[]> {
  const data = await fetchAPI(
    `
    query GetPosts($status: PostStatusEnum) {
      posts(where: { status: $status, orderby: { field: DATE, order: DESC }}) {
        nodes { title slug date status }
      }
    }
    `,
    { variables: { status }, asPreview } // ← pass asPreview so auth/no-store kicks in
  );
  return data?.posts?.nodes ?? [];
}

// List posts. Include drafts in dev OR when preview mode is on.
export async function getAllPosts(asPreview = false): Promise<WPost[]> {
  const includeDrafts = IS_LOCAL || asPreview;

  if (includeDrafts) {
    const [published, drafts] = await Promise.all([
      fetchPostsByStatus('PUBLISH', true),
      fetchPostsByStatus('DRAFT', true),
    ]);
    const bySlug = new Map<string, WPost>();
    [...published, ...drafts].forEach((p) => bySlug.set(p.slug, p));
    return [...bySlug.values()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // production (no preview): only published, cacheable
  return fetchPostsByStatus('PUBLISH', false);
}

// Single post. When `asPreview` is true (draftMode cookie set), WPGraphQL resolves the latest draft.
export async function getPostBySlug(
  slug: string,
  asPreview = false
): Promise<WPost> {
  const data = await fetchAPI(
    `
    query GetSinglePost($id: ID!, $asPreview: Boolean!) {
      post(id: $id, idType: SLUG, asPreview: $asPreview) {
        title
        date
        content
        slug
        status
        analyticsMetadata { pageSubcategory }
      }
    }
    `,
    { variables: { id: slug, asPreview }, asPreview }
  );

  const post: WPost = data?.post;
  if (post?.analyticsMetadata) {
    post.page_subcategory = post.analyticsMetadata.pageSubcategory;
  }
  return post;
}