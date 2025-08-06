// service.resolvers.ts
import { IResolvers } from 'apollo-server-express';
// AuthenticationError import removed; authentication checks are omitted
// from service mutations for simplicity.
import ServiceModel from '../../models/ServiceModel';

interface Context {
  user?: { id: string };
}

interface ServicesArgs {
  restaurantId?: string;
  hotelId?: string;
  salonId?: string;
  category?: string;
}

interface IdArg {
  id: string;
}

type CreateServiceInput = any;   // replace with your actual input type
type UpdateServiceInput = any;

interface MutationCreateArgs {
  input: CreateServiceInput;
}

interface MutationUpdateArgs {
  id: string;
  input: UpdateServiceInput;
}

export const serviceResolvers: IResolvers<unknown, Context> = {
  Query: {
    services: async (
      _parent,
      { restaurantId, hotelId, salonId, category }: ServicesArgs
    ) => {
      const filter: Record<string, any> = { isActive: true };
      if (restaurantId) filter.restaurantId = restaurantId;
      if (hotelId) filter.hotelId = hotelId;
      if (salonId) filter.salonId = salonId;
      if (category) filter.category = category;
      return ServiceModel.find(filter).sort({ name: 1 });
    },

    service: async (_parent, { id }: IdArg) => {
      return ServiceModel.findById(id);
    }
  },

  Mutation: {
    createService: async (
      _parent,
      { input }: MutationCreateArgs,
      _ctx: Context
    ) => {
      const service = new ServiceModel(input);
      await service.save();
      return service;
    },

    updateService: async (
      _parent,
      { id, input }: MutationUpdateArgs,
      _ctx: Context
    ) => {
      return ServiceModel.findByIdAndUpdate(id, input, { new: true });
    },

    deleteService: async (
      _parent,
      { id }: IdArg,
      _ctx: Context
    ) => {
      await ServiceModel.findByIdAndUpdate(id, { isActive: false });
      return true;
    }
  }
};
