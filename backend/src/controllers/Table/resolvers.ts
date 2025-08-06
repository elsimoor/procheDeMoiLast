// src/graphql/resolvers/tableResolvers.ts

// Authentication checks are intentionally removed to simplify
// development.  Clients may call these mutations without requiring
// authentication.
import { Types } from 'mongoose';
import TableModel from '../../models/TableModel';

interface Context {
  user?: any;
}

export const tableResolvers = {
  Query: {
    tables: async (
      _: any,
      { restaurantId, salonId, status }: { restaurantId?: string; salonId?: string; status?: string },
      _ctx: Context
    ) => {
      const filter: any = { isActive: true };
      if (restaurantId) filter.restaurantId = restaurantId;
      if (salonId) filter.salonId = salonId;
      if (status) {
        filter.status = status;
      }
      return TableModel.find(filter).sort({ number: 1 }).exec();
    },

    table: async (
      _: any,
      { id }: { id: string }
    ) => {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      return TableModel.findById(id).exec();
    },
  },

  Mutation: {
    createTable: async (
      _: any,
      { input },
      _ctx: Context
    ) => {
      const table = new TableModel(input);
      await table.save();
      return table;
    },

    updateTable: async (
      _: any,
      { id, input },
      _ctx: Context
    ) => {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      return TableModel.findByIdAndUpdate(id, input, { new: true }).exec();
    },

    deleteTable: async (
      _: any,
      { id }: { id: string },
      _ctx: Context
    ): Promise<boolean> => {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }
      await TableModel.findByIdAndUpdate(id, { isActive: false }).exec();
      return true;
    },
  },
};

