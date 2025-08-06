import ReservationModel from '../../models/ReservationModel';
import RestaurantModel from '../../models/RestaurantModel';
import { GraphQLError } from 'graphql';
import moment from 'moment';

export const dashboardResolvers = {
  Query: {
    dashboardMetrics: async (_, { restaurantId, from, to }) => {
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (!restaurant) {
        throw new GraphQLError('Restaurant not found.');
      }

      const startDate = from ? moment(from) : moment().startOf('month');
      const endDate = to ? moment(to) : moment().endOf('month');

      const reservations = await ReservationModel.find({
        businessId: restaurantId,
        businessType: 'restaurant',
        date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      });

      const confirmedReservations = reservations.filter(r => r.status === 'confirmed');

      const reservationsTotales = reservations.length;
      const chiffreAffaires = confirmedReservations.reduce((acc, r) => acc + (r.totalAmount || 0), 0);

      const settings = restaurant.settings;
      const capaciteEffectiveParCreneau = Math.min(
        settings.capaciteTotale || Infinity,
        settings.capaciteTheorique || Infinity,
        settings.maxReservationsParCreneau || Infinity
      );

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
      const start = moment(month).startOf('month').toDate();
      const end = moment(month).endOf('month').toDate();

      const reservations = await ReservationModel.find({
        businessId: restaurantId,
        businessType: 'restaurant',
        date: { $gte: start, $lte: end },
      }).select('date');

      const heatMap = reservations.reduce((acc, r) => {
        const dateStr = moment(r.date).format('YYYY-MM-DD');
        acc[dateStr] = (acc[dateStr] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(heatMap).map(([date, count]) => ({
        date,
        count,
      }));
    },

    reservationsByDate: async (_, { restaurantId, date }) => {
      const targetDate = moment(date).startOf('day').toDate();
      const nextDay = moment(targetDate).add(1, 'days').toDate();

      const reservations = await ReservationModel.find({
        businessId: restaurantId,
        businessType: 'restaurant',
        date: { $gte: targetDate, $lt: nextDay },
      }).populate('businessId');

      return reservations.map(r => ({
        id: r._id.toString(),
        date: moment(r.date).format('YYYY-MM-DD'),
        heure: r.time,
        restaurant: r.businessId ? (r.businessId as any).name : 'N/A',
        personnes: r.partySize,
        statut: r.status.toUpperCase(),
      }));
    }
  },
  Mutation: {
    updateReservationDetails: async (_, { id, input }) => {
      const reservation = await ReservationModel.findById(id);
      if (!reservation) throw new GraphQLError('Reservation not found.');

      // TODO: Add capacity check logic here later

      const updatedReservation = await ReservationModel.findByIdAndUpdate(id, input, { new: true }).populate('businessId');

      return {
        id: updatedReservation._id.toString(),
        date: moment(updatedReservation.date).format('YYYY-MM-DD'),
        heure: updatedReservation.time,
        restaurant: updatedReservation.businessId ? (updatedReservation.businessId as any).name : 'N/A',
        personnes: updatedReservation.partySize,
        statut: updatedReservation.status.toUpperCase(),
      };
    },
    cancelReservation: async (_, { id }) => {
      const cancelledReservation = await ReservationModel.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true }).populate('businessId');
      if (!cancelledReservation) throw new GraphQLError('Reservation not found.');

      return {
        id: cancelledReservation._id.toString(),
        date: moment(cancelledReservation.date).format('YYYY-MM-DD'),
        heure: cancelledReservation.time,
        restaurant: cancelledReservation.businessId ? (cancelledReservation.businessId as any).name : 'N/A',
        personnes: cancelledReservation.partySize,
        statut: cancelledReservation.status.toUpperCase(),
      };
    }
  }
};
