// reservation.schema.ts
import { gql } from 'apollo-server-express';

export const reservationTypeDef = gql`

  type Reservation {
    id: ID!
    # The client (tenant) that owns this reservation.  This replaces the
    # previous businessId field which returned a Hotel; now any
    # reservation is linked to a Client regardless of the module type.
    client: Client
    # Indicates the type of reservation: "hotel" (for rooms), "restaurant" or
    # "salon" (for services).  This naming remains for backwards
    # compatibility with existing models.
    businessType: String!
    customerId: User
    customerInfo: CustomerInfo!

    # Hotel specific
    roomId: Room
    checkIn: Date
    checkOut: Date
    guests: Int

    # Restaurant specific
    tableId: Table
    partySize: Int

    # Salon specific
    serviceId: Service
    staffId: Staff

    # Common fields
    date: Date!
    time: String
    duration: Int
    status: String!
    totalAmount: Float
    paymentStatus: String!
    notes: String
    specialRequests: String
    reminderSent: Boolean!
    source: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type CustomerInfo {
    name: String!
    email: String!
    phone: String!
  }
`;
