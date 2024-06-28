import { gql } from 'graphql-tag';
import { isDefined, run } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.7", import: ["@key"])

  interface Media @key(fields: "id") {
    id: ID!
    title: String
  }

  type Book implements Media @key(fields: "id") {
    id: ID!
    title: String
    numberOfPages: Int!
  }

  type Album implements Media @key(fields: "id") {
    id: ID!
    title: String
    numberOfSongs: Int!
  }

  type Magazine implements Media @key(fields: "id") {
    id: ID!
    title: String
    numberOfSections: Int!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Media: {
    __resolveType: async (media: { numberOfPages?: number; numberOfSongs?: number; numberOfSections?: number }) => {
      if (isDefined(media.numberOfPages)) {
        return 'Book';
      } else if (isDefined(media.numberOfSongs)) {
        return 'Album';
      } else if (isDefined(media.numberOfSections)) {
        return 'Magazine';
      }
      return null;
    },

    __resolveReference: async ({ id }: { id: string }) => {
      if (id === '1') {
        return { id, title: 'Lord of the rings', numberOfPages: 555 };
      } else if (id === '2') {
        return { id, title: 'Thriller', numberOfSongs: 9 };
      } else if (id === '3') {
        return { id, title: 'Ok', numberOfSections: 5 };
      }

      return null;
    },
  },
};

export const runA = () => run(typeDefs, resolvers, 3001, 'SubgraphA');
