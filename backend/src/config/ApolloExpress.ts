import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { resolvers } from '../controllers';

export const createApolloServer = async () => {
  const schema = await buildSchema({
    resolvers,
    validate: false,
  });

  return new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });
};
