import { gql } from 'apollo-server-express';

export const privatisationTypeDef = gql`
  type PrivatisationOption {
    id: ID!
    nom: String!
    description: String
    type: String!
    capaciteMaximale: Int!
    dureeMaximaleHeures: Int!
    menusDeGroupe: [String!]!
    restaurantId: ID!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreatePrivatisationOptionInput {
    nom: String!
    description: String
    type: String!
    capaciteMaximale: Int!
    dureeMaximaleHeures: Int!
    menusDeGroupe: [String!]
    restaurantId: ID!
  }

  input UpdatePrivatisationOptionInput {
    nom: String
    description: String
    type: String
    capaciteMaximale: Int
    dureeMaximaleHeures: Int
    menusDeGroupe: [String!]
  }

  extend type Query {
    privatisationOptionsByRestaurant(restaurantId: ID!): [PrivatisationOption!]!
    privatisationOption(id: ID!): PrivatisationOption
  }

  extend type Mutation {
    createPrivatisationOption(input: CreatePrivatisationOptionInput!): PrivatisationOption!
    updatePrivatisationOption(id: ID!, input: UpdatePrivatisationOptionInput!): PrivatisationOption!
    deletePrivatisationOption(id: ID!): Boolean!
  }
`;
