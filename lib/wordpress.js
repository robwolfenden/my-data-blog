
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
  const data = await graphQLClient.request(query);
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
  const data = await graphQLClient.request(query, variables);
  return data.post;
}