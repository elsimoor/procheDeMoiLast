"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessTypeDef = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.businessTypeDef = (0, apollo_server_express_1.gql) `

  type OpeningPeriod {
    startDate: Date!
    endDate: Date!
  }

  type Hotel {
    id: ID!
    name: String!
    description: String
    address: Address
    contact: Contact
    settings: HotelSettings
    amenities: [Amenity!]!
    services: [BusinessService!]!
    policies: [Policy!]!
    images: [String!]!
    rating: Rating
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
    # Opening periods during which reservations are allowed
    openingPeriods: [OpeningPeriod!]
  }

  type Restaurant {
    id: ID!
    name: String!
    description: String
    address: Address
    contact: Contact
    settings: RestaurantSettings
    businessHours: [BusinessHours!]!
    cuisine: [String!]!
    priceRange: String
    features: [String!]!
    policies: [Policy!]!
    images: [String!]!
    rating: Rating
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Salon {
    id: ID!
    name: String!
    description: String
    address: Address
    contact: Contact
    settings: SalonSettings
    businessHours: [BusinessHours!]!
    specialties: [String!]!
    policies: [Policy!]!
    images: [String!]!
    rating: Rating
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Address {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  type Contact {
    phone: String
    email: String
    website: String
  }

  type HotelSettings {
    checkInTime: String
    checkOutTime: String
    currency: String
    timezone: String
    taxRate: Float
    serviceFee: Float
  }

  type RestaurantSettings {
    currency: String
    timezone: String
    taxRate: Float
    serviceFee: Float
    maxPartySize: Int
    reservationWindow: Int
    cancellationHours: Int
    horaires: [Horaire!]
    capaciteTotale: Int
    tables: Tables
    frequenceCreneauxMinutes: Int
    maxReservationsParCreneau: Int
    capaciteTheorique: Int
  }

  type Horaire {
    ouverture: String
    fermeture: String
  }

  type Tables {
    size2: Int
    size4: Int
    size6: Int
    size8: Int
  }

  input RestaurantSettingsInput {
    currency: String
    timezone: String
    taxRate: Float
    serviceFee: Float
    maxPartySize: Int
    reservationWindow: Int
    cancellationHours: Int
    horaires: [HoraireInput!]
    capaciteTotale: Int
    tables: TablesInput
    frequenceCreneauxMinutes: Int
    maxReservationsParCreneau: Int
  }

  input HoraireInput {
    ouverture: String
    fermeture: String
  }

  input TablesInput {
    size2: Int
    size4: Int
    size6: Int
    size8: Int
  }

  type SalonSettings {
    currency: String
    timezone: String
    taxRate: Float
    serviceFee: Float
    cancellationHours: Int
  }

  type BusinessHours {
    day: String!
    isOpen: Boolean!
    openTime: String
    closeTime: String
  }

  type Amenity {
    name: String!
    description: String
    included: Boolean!
    category: String
    price: Float
  }

  type BusinessService {
    name: String!
    description: String
    price: Float!
    category: String
    available: Boolean!
  }

  type Policy {
    title: String!
    description: String!
    category: String!
  }

  type Rating {
    average: Float!
    count: Int!
  }

  extend type Mutation {
    updateRestaurant(id: ID!, input: UpdateRestaurantInput!): Restaurant
    createReservationV2(input: CreateReservationV2Input!): Reservation!
    createPrivatisationV2(input: CreatePrivatisationV2Input!): Reservation!
  }

  input UpdateRestaurantInput {
    name: String
    description: String
    address: AddressInput
    contact: ContactInput
    settings: RestaurantSettingsInput
    cuisine: [String!]
    priceRange: String
    features: [String!]
    images: [String!]
    isActive: Boolean
  }

  input AddressInput {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  input ContactInput {
    phone: String
    email: String
    website: String
  }
`;
//# sourceMappingURL=typeDefs.js.map