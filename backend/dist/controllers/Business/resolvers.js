"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessResolvers = void 0;
// business.resolvers.ts
const graphql_1 = require("graphql");
const HotelModel_1 = __importDefault(require("../../models/HotelModel"));
const RestaurantModel_1 = __importDefault(require("../../models/RestaurantModel"));
const SalonModel_1 = __importDefault(require("../../models/SalonModel"));
const ReservationModel_1 = __importDefault(require("../../models/ReservationModel"));
exports.businessResolvers = {
    Query: {
        hotels: async () => {
            return HotelModel_1.default.find({ isActive: true });
        },
        hotel: async (_parent, { id }) => {
            return HotelModel_1.default.findById(id);
        },
        restaurants: async () => {
            return RestaurantModel_1.default.find({ isActive: true });
        },
        restaurant: async (_parent, { id }) => {
            return RestaurantModel_1.default.findById(id);
        },
        salons: async () => {
            return SalonModel_1.default.find({ isActive: true });
        },
        salon: async (_parent, { id }) => {
            return SalonModel_1.default.findById(id);
        }
    },
    Mutation: {
        createHotel: async (_parent, { input }) => {
            const hotel = new HotelModel_1.default(input);
            await hotel.save();
            return hotel;
        },
        updateHotel: async (_parent, { id, input }, _ctx) => {
            return HotelModel_1.default.findByIdAndUpdate(id, input, { new: true });
        },
        deleteHotel: async (_parent, { id }, _ctx) => {
            await HotelModel_1.default.findByIdAndUpdate(id, { isActive: false });
            return true;
        },
        createRestaurant: async (_parent, { input }, _ctx) => {
            const restaurant = new RestaurantModel_1.default(input);
            await restaurant.save();
            return restaurant;
        },
        updateRestaurant: async (_parent, { id, input }, _ctx) => {
            if (input.settings) {
                const { horaires, frequenceCreneauxMinutes, maxReservationsParCreneau, capaciteTotale, tables } = input.settings;
                // Validate horaires: ouverture < fermeture
                if (horaires) {
                    for (const horaire of horaires) {
                        if (horaire.ouverture && horaire.fermeture && horaire.ouverture >= horaire.fermeture) {
                            throw new graphql_1.GraphQLError("L'heure d'ouverture doit être antérieure à l'heure de fermeture.", {
                                //@ts-ignore
                                extensions: { code: 'BAD_USER_INPUT', field: 'horaires' },
                            });
                        }
                    }
                }
                // Validate frequenceCreneauxMinutes: positive and divisible by 5
                if (frequenceCreneauxMinutes) {
                    if (frequenceCreneauxMinutes <= 0 || frequenceCreneauxMinutes % 5 !== 0) {
                        throw new graphql_1.GraphQLError("La fréquence des créneaux doit être un nombre positif divisible par 5.", {
                            //@ts-ignore
                            extensions: { code: 'BAD_USER_INPUT', field: 'frequenceCreneauxMinutes' },
                        });
                    }
                }
                // Calculate capaciteTheorique
                let capaciteTheorique = 0;
                if (tables) {
                    capaciteTheorique =
                        (tables.size2 || 0) * 2 +
                            (tables.size4 || 0) * 4 +
                            (tables.size6 || 0) * 6 +
                            (tables.size8 || 0) * 8;
                    input.settings.capaciteTheorique = capaciteTheorique;
                }
                // Validate maxReservationsParCreneau against capaciteTotale and capaciteTheorique
                if (maxReservationsParCreneau) {
                    if (capaciteTotale !== undefined && maxReservationsParCreneau > capaciteTotale) {
                        throw new graphql_1.GraphQLError("La limite par créneau ne peut pas dépasser la capacité totale.", {
                            //@ts-ignore
                            extensions: { code: 'BAD_USER_INPUT', field: 'maxReservationsParCreneau' },
                        });
                    }
                    if (tables && maxReservationsParCreneau > capaciteTheorique) {
                        throw new graphql_1.GraphQLError("La limite par créneau ne peut pas dépasser la capacité théorique.", {
                            //@ts-ignore
                            extensions: { code: 'BAD_USER_INPUT', field: 'maxReservationsParCreneau' },
                        });
                    }
                }
            }
            return RestaurantModel_1.default.findByIdAndUpdate(id, input, { new: true });
        },
        deleteRestaurant: async (_parent, { id }, _ctx) => {
            await RestaurantModel_1.default.findByIdAndUpdate(id, { isActive: false });
            return true;
        },
        createSalon: async (_parent, { input }, _ctx) => {
            const salon = new SalonModel_1.default(input);
            await salon.save();
            return salon;
        },
        updateSalon: async (_parent, { id, input }, _ctx) => {
            return SalonModel_1.default.findByIdAndUpdate(id, input, { new: true });
        },
        deleteSalon: async (_parent, { id }, _ctx) => {
            await SalonModel_1.default.findByIdAndUpdate(id, { isActive: false });
            return true;
        },
        createReservationV2: async (_parent, { input }) => {
            const { restaurantId, ...reservationData } = input;
            const reservation = new ReservationModel_1.default({
                ...reservationData,
                businessId: restaurantId,
                businessType: "restaurant",
                partySize: input.personnes,
                time: input.heure,
                status: "confirmed", // As per new flow, confirmation is the final step
            });
            await reservation.save();
            // Assuming the Reservation loader can resolve the fields
            return reservation;
        },
        createPrivatisationV2: async (_parent, { input }) => {
            const { restaurantId, ...privatisationData } = input;
            // This is a simplified version. A real implementation would need to
            // block the capacity for the given time slot.
            const reservation = new ReservationModel_1.default({
                ...privatisationData,
                businessId: restaurantId,
                businessType: "restaurant",
                partySize: input.personnes,
                time: input.heure,
                duration: input.dureeHeures,
                status: "confirmed",
                notes: `Privatisation: ${privatisationData.type} - ${privatisationData.espace}, Menu: ${privatisationData.menu}`,
                specialRequests: `Privatisation event for ${input.personnes} guests.`
            });
            await reservation.save();
            return reservation;
        }
    }
};
//# sourceMappingURL=resolvers.js.map