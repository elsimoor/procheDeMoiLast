"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardResolvers = void 0;
const ReservationModel_1 = __importDefault(require("../../models/ReservationModel"));
const RestaurantModel_1 = __importDefault(require("../../models/RestaurantModel"));
const graphql_1 = require("graphql");
const moment_1 = __importDefault(require("moment"));
exports.dashboardResolvers = {
    Query: {
        dashboardMetrics: async (_, { restaurantId, from, to }) => {
            const restaurant = await RestaurantModel_1.default.findById(restaurantId);
            if (!restaurant) {
                throw new graphql_1.GraphQLError('Restaurant not found.');
            }
            const startDate = from ? (0, moment_1.default)(from) : (0, moment_1.default)().startOf('month');
            const endDate = to ? (0, moment_1.default)(to) : (0, moment_1.default)().endOf('month');
            const reservations = await ReservationModel_1.default.find({
                businessId: restaurantId,
                businessType: 'restaurant',
                date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
            });
            const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
            const reservationsTotales = reservations.length;
            const chiffreAffaires = confirmedReservations.reduce((acc, r) => acc + (r.totalAmount || 0), 0);
            const settings = restaurant.settings;
            const capaciteEffectiveParCreneau = Math.min(settings.capaciteTotale || Infinity, settings.capaciteTheorique || Infinity, settings.maxReservationsParCreneau || Infinity);
            const days = endDate.diff(startDate, 'days') + 1;
            const totalCreneaux = days * ((settings.horaires.length || 1) * (60 / (settings.frequenceCreneauxMinutes || 30)));
            const capaciteTotaleSurPeriode = totalCreneaux * capaciteEffectiveParCreneau;
            const totalPersonnesConfirmees = confirmedReservations.reduce((acc, r) => acc + (r.partySize || 0), 0);
            const tauxRemplissage = capaciteTotaleSurPeriode > 0 ? (totalPersonnesConfirmees / capaciteTotaleSurPeriode) : 0;
            return {
                reservationsTotales,
                chiffreAffaires,
                tauxRemplissage: parseFloat(tauxRemplissage.toFixed(2)),
            };
        },
        dashboardCalendar: async (_, { restaurantId, month }) => {
            const start = (0, moment_1.default)(month).startOf('month').toDate();
            const end = (0, moment_1.default)(month).endOf('month').toDate();
            const reservations = await ReservationModel_1.default.find({
                businessId: restaurantId,
                businessType: 'restaurant',
                date: { $gte: start, $lte: end },
            }).select('date');
            const heatMap = reservations.reduce((acc, r) => {
                const dateStr = (0, moment_1.default)(r.date).format('YYYY-MM-DD');
                acc[dateStr] = (acc[dateStr] || 0) + 1;
                return acc;
            }, {});
            return Object.entries(heatMap).map(([date, count]) => ({
                date,
                count,
            }));
        },
        reservationsByDate: async (_, { restaurantId, date }) => {
            const targetDate = (0, moment_1.default)(date).startOf('day').toDate();
            const nextDay = (0, moment_1.default)(targetDate).add(1, 'days').toDate();
            const reservations = await ReservationModel_1.default.find({
                businessId: restaurantId,
                businessType: 'restaurant',
                date: { $gte: targetDate, $lt: nextDay },
            }).populate('businessId');
            return reservations.map(r => ({
                id: r._id.toString(),
                date: (0, moment_1.default)(r.date).format('YYYY-MM-DD'),
                heure: r.time,
                restaurant: r.businessId ? r.businessId.name : 'N/A',
                personnes: r.partySize,
                statut: r.status.toUpperCase(),
            }));
        },
        availability: async (_, { restaurantId, date, partySize }) => {
            const restaurant = await RestaurantModel_1.default.findById(restaurantId).lean();
            if (!restaurant) {
                throw new graphql_1.GraphQLError('Restaurant not found.');
            }
            const settings = restaurant.settings;
            if (!settings || !settings.horaires || !settings.frequenceCreneauxMinutes) {
                throw new graphql_1.GraphQLError('Restaurant settings for availability are incomplete.');
            }
            const targetDate = moment_1.default.utc(date);
            // 1. Generate all possible slots for the day
            const allSlots = [];
            settings.horaires.forEach(h => {
                if (!h.ouverture || !h.fermeture)
                    return;
                let current = moment_1.default.utc(`${date}T${h.ouverture}`);
                const end = moment_1.default.utc(`${date}T${h.fermeture}`);
                while (current.isBefore(end)) {
                    allSlots.push(current.format('HH:mm'));
                    current.add(settings.frequenceCreneauxMinutes, 'minutes');
                }
            });
            // 2. Get all confirmed reservations for the day
            const startOfDay = moment_1.default.utc(date).startOf('day').toDate();
            const endOfDay = moment_1.default.utc(date).endOf('day').toDate();
            const reservations = await ReservationModel_1.default.find({
                businessId: restaurantId,
                businessType: 'restaurant',
                date: { $gte: startOfDay, $lt: endOfDay },
                status: { $in: ['confirmed', 'pending'] } // Consider pending as well
            }).select('time partySize');
            // 3. Calculate bookings per slot
            const bookingsBySlot = reservations.reduce((acc, r) => {
                if (r.time) {
                    acc[r.time] = (acc[r.time] || 0) + (r.partySize || 0);
                }
                return acc;
            }, {});
            // 4. Determine availability for each slot
            // Effective capacity per slot is the minimum of total capacity and max reservations per slot
            const capaciteEffective = Math.min(settings.capaciteTotale || Infinity, settings.maxReservationsParCreneau || Infinity);
            const availabilitySlots = allSlots.map(slot => {
                const currentBookings = bookingsBySlot[slot] || 0;
                const available = (currentBookings + partySize) <= capaciteEffective;
                return { time: slot, available };
            });
            return availabilitySlots;
        }
    },
    Mutation: {
        updateReservationDetails: async (_, { id, input }) => {
            const reservation = await ReservationModel_1.default.findById(id);
            if (!reservation)
                throw new graphql_1.GraphQLError('Reservation not found.');
            // TODO: Add capacity check logic here later
            const updatedReservation = await ReservationModel_1.default.findByIdAndUpdate(id, input, { new: true }).populate('businessId');
            return {
                id: updatedReservation._id.toString(),
                date: (0, moment_1.default)(updatedReservation.date).format('YYYY-MM-DD'),
                heure: updatedReservation.time,
                restaurant: updatedReservation.businessId ? updatedReservation.businessId.name : 'N/A',
                personnes: updatedReservation.partySize,
                statut: updatedReservation.status.toUpperCase(),
            };
        },
        cancelReservation: async (_, { id }) => {
            const cancelledReservation = await ReservationModel_1.default.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true }).populate('businessId');
            if (!cancelledReservation)
                throw new graphql_1.GraphQLError('Reservation not found.');
            return {
                id: cancelledReservation._id.toString(),
                date: (0, moment_1.default)(cancelledReservation.date).format('YYYY-MM-DD'),
                heure: cancelledReservation.time,
                restaurant: cancelledReservation.businessId ? cancelledReservation.businessId.name : 'N/A',
                personnes: cancelledReservation.partySize,
                statut: cancelledReservation.status.toUpperCase(),
            };
        }
    }
};
//# sourceMappingURL=resolvers.js.map