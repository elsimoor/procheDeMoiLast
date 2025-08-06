import { gql } from 'apollo-server-express';

export const staffTypeDef = gql`
  type Staff {
    id: ID!
    restaurantId: ID
    hotelId: ID
    salonId: ID
    userId: ID
    name: String!
    role: String!
    email: String
    phone: String
    hireDate: Date
    schedule: String!
    hourlyRate: Float
    status: String!
    specialties: [String!]!
    availability: [Availability!]!
    avatar: String
    notes: String
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Availability {
    day: String!
    startTime: String!
    endTime: String!
    available: Boolean!
  }
`;

