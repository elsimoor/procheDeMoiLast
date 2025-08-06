// src/graphql/resolvers/staffResolvers.ts

// Authentication checks have been removed from staff mutations for
// simplicity.  Clients may perform CRUD operations without requiring
// an authenticated user.
import { Types } from 'mongoose';
import StaffModel from '../../models/StaffModel';

interface Context {
  user?: any;
}

export const staffResolvers = {
  Query: {
    staff: async (
      _: any,
      { restaurantId, hotelId, salonId, role }: { restaurantId?: string; hotelId?: string; salonId?: string; role?: string },
      _ctx: Context
    ) => {
      const filter: any = { isActive: true };
      if (restaurantId) filter.restaurantId = restaurantId;
      if (hotelId) filter.hotelId = hotelId;
      if (salonId) filter.salonId = salonId;
      if (role) {
        filter.role = new RegExp(role, 'i');
      }
      return StaffModel.find(filter).sort({ name: 1 }).exec();
    },

    staffMember: async (
      _: any,
      { id }: { id: string }
    ) => {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      return StaffModel.findById(id).exec();
    },
  },

  Mutation: {
    createStaff: async (
      _: any,
      { input }: any,
      _ctx: Context
    ) => {
      const staff = new StaffModel(input);
      await staff.save();
      return staff;
    },

    updateStaff: async (
      _: any,
      { id, input }: any,
      _ctx: Context
    ) => {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      return StaffModel.findByIdAndUpdate(id, input, { new: true }).exec();
    },

    deleteStaff: async (
      _: any,
      { id }: { id: string },
      _ctx: Context
    ): Promise<boolean> => {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }
      await StaffModel.findByIdAndUpdate(id, { isActive: false }).exec();
      return true;
    },
  },
};

