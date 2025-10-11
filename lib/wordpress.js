import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'http://34.88.16.249/graphql'; // <-- IMPORTANT: Replace with your GCP IP

const graphQLClient = new GraphQLClient(endpoint);

/**
 * Fetches the title, slug, and date for all posts.
 * Used for the homepage list.
 */
export async function getAllPosts() {
  const query = gql`
    query GetPosts {
      posts {
        nodes {
          title
          slug
          date
        }
      }
    }
  `;

  // We pass a 'next' object with a revalidate time (in seconds)
  // This tells Next.js to regenerate this page at most once every 60 seconds
  const data = await graphQLClient.request(query, undefined, undefined, undefined, { next: { revalidate: 60 } });
  
  return data.posts.nodes;
}

/**
 * Fetches a single post by its slug (the URL-friendly title).
 * Used for the individual blog post pages.
 */
export async function getPostBySlug(slug) {
  const query = gql`
    query GetSinglePost($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        date
        content
      }
    }
  `;
  const variables = {
    id: slug,
  };
  
  // Also add revalidation here so individual posts can be updated
  const data = await graphQLClient.request(query, variables, undefined, undefined, { next: { revalidate: 60 } });

  return data.post;
}