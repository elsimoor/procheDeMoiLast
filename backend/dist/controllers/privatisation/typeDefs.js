"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privatisationTypeDef = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.privatisationTypeDef = (0, apollo_server_express_1.gql) `
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
//# sourceMappingURL=typeDefs.js.map