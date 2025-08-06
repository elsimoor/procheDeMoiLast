import { Resolver, Query, Arg, ID, Mutation } from "type-graphql";
import { Hotel, HotelModel } from "../models/HotelModel";
import { HotelInput } from "./inputs";
import { Restaurant, RestaurantModel } from "../models/RestaurantModel";
import { RestaurantInput } from "./inputs";
import { Salon, SalonModel } from "../models/SalonModel";
import { SalonInput } from "./inputs";

@Resolver()
export class AllResolver {
    @Query(() => [Hotel])
    async hotels(): Promise<Hotel[]> {
        return await HotelModel.find();
    }

    @Query(() => Hotel, { nullable: true })
    async hotel(@Arg("id", () => ID) id: string): Promise<Hotel | null> {
        return await HotelModel.findById(id);
    }

    @Mutation(() => Hotel)
    async createHotel(@Arg("input") input: HotelInput): Promise<Hotel> {
        const hotel = new HotelModel(input);
        await hotel.save();
        return hotel;
    }

    @Mutation(() => Hotel, { nullable: true })
    async updateHotel(
        @Arg("id", () => ID) id: string,
        @Arg("input") input: HotelInput
    ): Promise<Hotel | null> {
        return await HotelModel.findByIdAndUpdate(id, input, { new: true });
    }

    @Query(() => [Restaurant])
    async restaurants(): Promise<Restaurant[]> {
        return await RestaurantModel.find();
    }

    @Query(() => Restaurant, { nullable: true })
    async restaurant(@Arg("id", () => ID) id: string): Promise<Restaurant | null> {
        return await RestaurantModel.findById(id);
    }

    @Mutation(() => Restaurant)
    async createRestaurant(@Arg("input") input: RestaurantInput): Promise<Restaurant> {
        const restaurant = new RestaurantModel(input);
        await restaurant.save();
        return restaurant;
    }

    @Mutation(() => Restaurant, { nullable: true })
    async updateRestaurant(
        @Arg("id", () => ID) id: string,
        @Arg("input") input: RestaurantInput
    ): Promise<Restaurant | null> {
        const { settings, tableCounts, ...rest } = input;
        const update: any = { ...rest };

        if (settings) {
            update.settings = settings;
        }

        if (tableCounts) {
            update.tableCounts = tableCounts;
        }

        return await RestaurantModel.findByIdAndUpdate(id, update, { new: true });
    }

    @Query(() => [Salon])
    async salons(): Promise<Salon[]> {
        return await SalonModel.find();
    }

    @Query(() => Salon, { nullable: true })
    async salon(@Arg("id", () => ID) id: string): Promise<Salon | null> {
        return await SalonModel.findById(id);
    }

    @Mutation(() => Salon)
    async createSalon(@Arg("input") input: SalonInput): Promise<Salon> {
        const salon = new SalonModel(input);
        await salon.save();
        return salon;
    }

    @Mutation(() => Salon, { nullable: true })
    async updateSalon(
        @Arg("id", () => ID) id: string,
        @Arg("input") input: SalonInput
    ): Promise<Salon | null> {
        return await SalonModel.findByIdAndUpdate(id, input, { new: true });
    }
}
