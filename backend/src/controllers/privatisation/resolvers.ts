import PrivatisationOptionModel from '../../models/PrivatisationOptionModel';

interface Context {
  user?: { id: string };
}

interface IdArg {
  id: string;
}

interface CreatePrivatisationOptionInput {
  nom: string;
  description?: string;
  type: string;
  capaciteMaximale: number;
  dureeMaximaleHeures: number;
  menusDeGroupe?: string[];
  restaurantId: string;
}

interface UpdatePrivatisationOptionInput {
  nom?: string;
  description?: string;
  type?: string;
  capaciteMaximale?: number;
  dureeMaximaleHeures?: number;
  menusDeGroupe?: string[];
}

interface MutationCreateArgs {
  input: CreatePrivatisationOptionInput;
}

interface MutationUpdateArgs {
  id: string;
  input: UpdatePrivatisationOptionInput;
}

export const privatisationResolvers = {
  Query: {
    privatisationOptionsByRestaurant: async (_parent, { restaurantId }) => {
      return PrivatisationOptionModel.find({ restaurantId });
    },
    privatisationOption: async (_parent, { id }: IdArg) => {
      return PrivatisationOptionModel.findById(id);
    },
  },

  Mutation: {
    createPrivatisationOption: async (
      _parent,
      { input }: MutationCreateArgs,
      _ctx: Context
    ) => {
      const newOption = new PrivatisationOptionModel(input);
      await newOption.save();
      return newOption;
    },

    updatePrivatisationOption: async (
      _parent,
      { id, input }: MutationUpdateArgs,
      _ctx: Context
    ) => {
      return PrivatisationOptionModel.findByIdAndUpdate(id, input, { new: true });
    },

    deletePrivatisationOption: async (
      _parent,
      { id }: IdArg,
      _ctx: Context
    ): Promise<boolean> => {
      await PrivatisationOptionModel.findByIdAndDelete(id);
      return true;
    },
  },
};
