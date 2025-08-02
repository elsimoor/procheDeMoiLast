"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessResolvers = void 0;
// business.resolvers.ts
// Authentication checks removed; import not needed.
const HotelModel_1 = __importDefault(require("../../models/HotelModel"));
const RestaurantModel_1 = __importDefault(require("../../models/RestaurantModel"));
const SalonModel_1 = __importDefault(require("../../models/SalonModel"));
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
        }
    }
};
//# sourceMappingURL=resolvers.js.map