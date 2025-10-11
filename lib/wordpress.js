import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'http://34.88.16.249/graphql'; // <-- IMPORTANT: Replace with your GCP IP

const graphQLClient = new GraphQLClient(endpoint);

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