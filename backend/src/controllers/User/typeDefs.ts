// auth.schema.ts
import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`

  type User {
    id: ID!
    lastName: String
    firstName: String
    email: String!
    role: String!
    restaurantId: ID
    hotelId: ID
    salonId: ID
    avatar: String
    phone: String
    isActive: Boolean!
    lastLogin: Date
    preferences: UserPreferences
    createdAt: Date!
    updatedAt: Date!
  }

  type UserPreferences {
    notifications: NotificationPreferences
    language: String
    timezone: String
  }

  type NotificationPreferences {
    email: Boolean
    sms: Boolean
    push: Boolean
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    lastName: String!
    firstName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UserUpdateInput {
    restaurantId: ID
    hotelId: ID
    salonId: ID
    role: String
  }
`;
