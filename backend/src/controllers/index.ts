import { gql } from "apollo-server-express";
import { businessResolvers, businessTypeDef } from "./Business";
import { guestResolvers, guestTypeDef } from "./Guest";
import { menuResolvers, menuItemTypeDef } from "./menuItem";
import { reservationResolvers, reservationTypeDef } from "./reservation";
import { roomResolvers, roomTypeDef } from "./Room";
import { serviceResolvers, serviceTypeDef } from "./service";
import { staffResolvers, staffTypeDef } from "./Staff";
import { tableResolvers, tableTypeDefs } from "./Table";
import { userResolvers, userTypeDefs } from "./User";

// New client controller providing multi‑tenant support
import { clientResolvers, clientTypeDefs } from "./Client";




import { root } from "./All";
import { inputs } from "./inputs";

export const extendedTypeDefs = gql`
  scalar Date
  type Query {
    _: String!
  }
  type Mutation {
    _: String
  }
`;


const resolvers = [
  userResolvers,
  businessResolvers,
  guestResolvers,
  menuResolvers,
  reservationResolvers,
  roomResolvers,
  serviceResolvers,
  staffResolvers,
  tableResolvers,
  clientResolvers,


];
const typeDefs = [
  userTypeDefs,
  extendedTypeDefs,
  businessTypeDef,
  guestTypeDef,
  menuItemTypeDef,
  reservationTypeDef,
  roomTypeDef,
  serviceTypeDef,
  staffTypeDef,
  tableTypeDefs,
  clientTypeDefs,
  inputs,
  root,
];
export { resolvers, typeDefs };
