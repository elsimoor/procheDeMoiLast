// business.resolvers.ts
// Authentication checks removed; import not needed.
import HotelModel from '../../models/HotelModel';
import RestaurantModel from '../../models/RestaurantModel';
import SalonModel from '../../models/SalonModel';


interface Context {
  user?: { id: string };
}

interface IdArg {
  id: string;
}

type CreateHotelInput = any;      // replace `any` with your actual input shape
type UpdateHotelInput = any;
type CreateRestaurantInput = any;

type CreateSalonInput = any;
type UpdateSalonInput = any;

interface MutationArgs<I = any> {
  input: I;
}
interface MutationUpdateArgs<I = any> {
  id: string;
  input: I;
}

export const businessResolvers = {
  Query: {
    hotels: async () => {
      return HotelModel.find({ isActive: true }) 
    },
    hotel: async (_parent, { id }: IdArg) => {
      return HotelModel.findById(id) 
    },
    restaurants: async () => {
      return RestaurantModel.find({ isActive: true }) 
    },
    restaurant: async (_parent, { id }: IdArg) => {
      return RestaurantModel.findById(id) 
    },
    salons: async () => {
      return SalonModel.find({ isActive: true }) 
    },
    salon: async (_parent, { id }: IdArg) => {
      return SalonModel.findById(id) 
    }
  },

  Mutation: {
    createHotel: async (
      _parent,
      { input }: MutationArgs<CreateHotelInput>,
    ) => {
      const hotel = new HotelModel(input);
      await hotel.save();
      return hotel as any;
    },

    updateHotel: async (
      _parent,
      { id, input }: MutationUpdateArgs<UpdateHotelInput>,
      _ctx: Context
    ) => {
      return HotelModel.findByIdAndUpdate(id, input, { new: true });
    },

    deleteHotel: async (
      _parent,
      { id }: IdArg,
      _ctx: Context
    ): Promise<boolean> => {
      await HotelModel.findByIdAndUpdate(id, { isActive: false });
      return true;
    },

    createRestaurant: async (
      _parent,
      { input }: MutationArgs<CreateRestaurantInput>,
      _ctx: Context
    ) => {
      const restaurant = new RestaurantModel(input);
      await restaurant.save();
      return restaurant as any;
    },

    updateRestaurant: async (
      _parent,
      { id, input },
      _ctx: Context
    ) => {
      if (input.settings && input.settings.tables) {
        const tables = input.settings.tables;
        const capaciteTheorique = (tables['2'] || 0) * 2 + (tables['4'] || 0) * 4 + (tables['6'] || 0) * 6 + (tables['8'] || 0) * 8;
        input.settings['capaciteTheorique'] = capaciteTheorique;
      }
      return RestaurantModel.findByIdAndUpdate(id, input, { new: true });
    },

    deleteRestaurant: async (
      _parent,
      { id }: IdArg,
      _ctx: Context
    ): Promise<boolean> => {
      await RestaurantModel.findByIdAndUpdate(id, { isActive: false });
      return true;
    },

    createSalon: async (
      _parent,
      { input }: MutationArgs<CreateSalonInput>,
      _ctx: Context
    ) => {
      const salon = new SalonModel(input);
      await salon.save();
      return salon as any;
    },

    updateSalon: async (
      _parent,
      { id, input }: MutationUpdateArgs<UpdateSalonInput>,
      _ctx: Context
    ) => {
      return SalonModel.findByIdAndUpdate(id, input, { new: true });
    },

    deleteSalon: async (
      _parent,
      { id }: IdArg,
      _ctx: Context
    ): Promise<boolean> => {
      await SalonModel.findByIdAndUpdate(id, { isActive: false });
      return true;
    }
  }
};

