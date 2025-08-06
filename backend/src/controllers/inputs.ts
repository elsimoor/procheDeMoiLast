import { InputType, Field, ID } from "type-graphql";
import { Length, IsEmail } from "class-validator";

@InputType()
export class AddressInput {
    @Field({ nullable: true })
    street?: string;

    @Field({ nullable: true })
    city?: string;

    @Field({ nullable: true })
    state?: string;

    @Field({ nullable: true })
    zipCode?: string;

    @Field({ nullable: true })
    country?: string;
}

@InputType()
export class ContactInput {
    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    website?: string;
}

@InputType()
export class ModulesInput {
    @Field()
    rooms: boolean;

    @Field()
    services: boolean;

    @Field()
    restaurant: boolean;
}

@InputType()
export class ThemeInput {
    @Field({ nullable: true })
    primaryColor?: string;

    @Field({ nullable: true })
    secondaryColor?: string;

    @Field({ nullable: true })
    typography?: string;

    @Field({ nullable: true })
    logoUrl?: string;
}

@InputType()
export class ClientInput {
    @Field()
    @Length(1, 255)
    name: string;

    @Field({ nullable: true })
    siret?: string;

    @Field(() => AddressInput, { nullable: true })
    address?: AddressInput;

    @Field(() => ContactInput, { nullable: true })
    contact?: ContactInput;

    @Field(() => ModulesInput)
    modules: ModulesInput;

    @Field(() => ThemeInput, { nullable: true })
    theme?: ThemeInput;
}

@InputType()
export class ClientUpdateInput {
    @Field({ nullable: true })
    @Length(1, 255)
    name?: string;

    @Field({ nullable: true })
    siret?: string;

    @Field({ nullable: true })
    isActive?: boolean;

    @Field(() => AddressInput, { nullable: true })
    address?: AddressInput;

    @Field(() => ContactInput, { nullable: true })
    contact?: ContactInput;

    @Field(() => ModulesInput, { nullable: true })
    modules?: ModulesInput;

    @Field(() => ThemeInput, { nullable: true })
    theme?: ThemeInput;
}

@InputType()
export class CustomerInfoInput {
    @Field()
    name: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    phone: string;
}

@InputType()
export class ReservationInput {
    @Field(() => ID)
    businessId: string;

    @Field()
    businessType: string;

    @Field(() => ID, { nullable: true })
    customerId?: string;

    @Field()
    date: Date;

    @Field({ nullable: true })
    time?: string;

    @Field({ nullable: true })
    partySize?: number;

    @Field({ nullable: true })
    duration?: number;

    @Field(() => ID, { nullable: true })
    tableId?: string;

    @Field(() => ID, { nullable: true })
    roomId?: string;

    @Field(() => ID, { nullable: true })
    serviceId?: string;

    @Field(() => ID, { nullable: true })
    staffId?: string;

    @Field({ nullable: true })
    checkIn?: Date;

    @Field({ nullable: true })
    checkOut?: Date;

    @Field({ nullable: true })
    guests?: number;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    notes?: string;

    @Field({ nullable: true })
    specialRequests?: string;

    @Field({ nullable: true })
    totalAmount?: number;

    @Field({ nullable: true })
    paymentStatus?: string;

    @Field({ nullable: true })
    source?: string;

    @Field(() => CustomerInfoInput)
    customerInfo: CustomerInfoInput;
}

@InputType()
export class RoomInput {
    @Field(() => ID)
    hotelId: string;

    @Field()
    number: string;

    @Field()
    type: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    price: number;

    @Field(() => [String])
    amenities: string[];

    @Field(() => [String])
    images: string[];

    @Field()
    capacity: number;

    @Field({ nullable: true })
    numberOfBeds?: number;

    @Field(() => [String], { nullable: true })
    bedType?: string[];

    @Field({ nullable: true })
    numberOfBathrooms?: number;

    @Field({ nullable: true })
    size?: number;

    @Field({ nullable: true })
    floor?: number;

    @Field(() => [String], { nullable: true })
    features?: string[];

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    condition?: string;

    @Field({ nullable: true })
    lastCleaned?: Date;

    @Field({ nullable: true })
    nextMaintenance?: Date;
}

@InputType()
export class ServiceInput {
    @Field(() => ID)
    businessId: string;

    @Field()
    businessType: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    price: number;

    @Field({ nullable: true })
    duration?: number;

    @Field({ nullable: true })
    category?: string;

    @Field(() => [String], { nullable: true })
    images?: string[];

    @Field({ nullable: true })
    available?: boolean;

    @Field({ nullable: true })
    popular?: boolean;

    @Field(() => [String], { nullable: true })
    requirements?: string[];

    @Field(() => [String], { nullable: true })
    staffRequired?: string[];

    @Field(() => ID, { nullable: true })
    defaultEmployee?: string;

    @Field(() => ID, { nullable: true })
    defaultRoom?: string;

    @Field({ nullable: true })
    allowClientChoose?: boolean;
}

@InputType()
export class TableInput {
    @Field(() => ID)
    restaurantId: string;

    @Field()
    number: number;

    @Field()
    capacity: number;

    @Field()
    location: string;

    @Field({ nullable: true })
    status?: string;

    @Field(() => [String], { nullable: true })
    features?: string[];

    @Field(() => [String], { nullable: true })
    images?: string[];
}

@InputType()
export class PositionInput {
    @Field()
    x: number;

    @Field()
    y: number;
}

@InputType()
export class NutritionalInfoInput {
    @Field({ nullable: true })
    calories?: number;

    @Field({ nullable: true })
    protein?: number;

    @Field({ nullable: true })
    fat?: number;

    @Field({ nullable: true })
    carbs?: number;
}

@InputType()
export class MenuItemInput {
    @Field(() => ID)
    restaurantId: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    category: string;

    @Field()
    price: number;

    @Field({ nullable: true })
    prepTime?: number;

    @Field({ nullable: true })
    available?: boolean;

    @Field({ nullable: true })
    popular?: boolean;

    @Field(() => [String], { nullable: true })
    allergens?: string[];

    @Field(() => [String], { nullable: true })
    dietaryInfo?: string[];

    @Field({ nullable: true })
    spiceLevel?: string;

    @Field(() => [String], { nullable: true })
    ingredients?: string[];

    @Field(() => NutritionalInfoInput, { nullable: true })
    nutritionalInfo?: NutritionalInfoInput;

    @Field(() => [String], { nullable: true })
    images?: string[];
}

@InputType()
export class AvailabilityInput {
    @Field()
    day: string;

    @Field()
    startTime: string;

    @Field()
    endTime: string;

    @Field()
    available: boolean;
}

@InputType()
export class StaffInput {
    @Field(() => ID)
    businessId: string;

    @Field()
    businessType: string;

    @Field()
    name: string;

    @Field()
    role: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field({ nullable: true })
    hourlyRate?: number;

    @Field({ nullable: true })
    status?: string;

    @Field(() => [String], { nullable: true })
    specialties?: string[];

    @Field(() => [AvailabilityInput], { nullable: true })
    availability?: AvailabilityInput[];

    @Field({ nullable: true })
    notes?: string;

    @Field({ nullable: true })
    hireDate?: Date;

    @Field({ nullable: true })
    schedule?: string;

    @Field(() => ID, { nullable: true })
    userId?: string;
}

@InputType()
export class CommunicationPreferencesInput {
    @Field({ nullable: true })
    email?: boolean;

    @Field({ nullable: true })
    phone?: boolean;

    @Field({ nullable: true })
    sms?: boolean;
}

@InputType()
export class GuestPreferencesInput {
    @Field(() => [String], { nullable: true })
    allergies?: string[];

    @Field(() => [String], { nullable: true })
    dietaryRestrictions?: string[];

    @Field({ nullable: true })
    seatingPreference?: string;

    @Field(() => [String], { nullable: true })
    cuisinePreferences?: string[];

    @Field({ nullable: true })
    bedType?: string;

    @Field({ nullable: true })
    roomType?: string;

    @Field({ nullable: true })
    floor?: string;

    @Field(() => [String], { nullable: true })
    favoriteServices?: string[];

    @Field({ nullable: true })
    preferredStylist?: string;
}

@InputType()
export class GuestInput {
    @Field(() => ID)
    businessId: string;

    @Field()
    businessType: string;

    @Field()
    name: string;

    @Field()
    @IsEmail()
    email: string;

    @Field({ nullable: true })
    phone?: string;

    @Field(() => AddressInput, { nullable: true })
    address?: AddressInput;

    @Field({ nullable: true })
    notes?: string;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    membershipLevel?: string;

    @Field(() => GuestPreferencesInput, { nullable: true })
    preferences?: GuestPreferencesInput;

    @Field(() => CommunicationPreferencesInput, { nullable: true })
    communicationPreferences?: CommunicationPreferencesInput;

    @Field(() => ID, { nullable: true })
    userId?: string;
}

@InputType()
export class BusinessHoursInput {
    @Field()
    day: string;

    @Field()
    isOpen: boolean;

    @Field({ nullable: true })
    openTime?: string;

    @Field({ nullable: true })
    closeTime?: string;
}

@InputType()
export class PolicyInput {
    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    category: string;
}

@InputType()
export class HotelSettingsInput {
    @Field({ nullable: true })
    currency?: string;

    @Field({ nullable: true })
    timezone?: string;

    @Field({ nullable: true })
    taxRate?: number;

    @Field({ nullable: true })
    serviceFee?: number;

    @Field({ nullable: true })
    checkInTime?: string;

    @Field({ nullable: true })
    checkOutTime?: string;
}

@InputType()
export class OpeningPeriodInput {
    @Field()
    startDate: Date;

    @Field()
    endDate: Date;
}

@InputType()
export class HotelInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => AddressInput, { nullable: true })
    address?: AddressInput;

    @Field(() => ContactInput, { nullable: true })
    contact?: ContactInput;

    @Field(() => [String], { nullable: true })
    images?: string[];

    @Field(() => [AmenityInput], { nullable: true })
    amenities?: AmenityInput[];

    @Field(() => [BusinessServiceInput], { nullable: true })
    services?: BusinessServiceInput[];

    @Field(() => HotelSettingsInput, { nullable: true })
    settings?: HotelSettingsInput;

    @Field(() => [PolicyInput], { nullable: true })
    policies?: PolicyInput[];

    @Field(() => [OpeningPeriodInput], { nullable: true })
    openingPeriods?: OpeningPeriodInput[];
}

@InputType()
export class RestaurantSettingsInput {
    @Field({ nullable: true })
    currency?: string;

    @Field({ nullable: true })
    timezone?: string;

    @Field({ nullable: true })
    taxRate?: number;

    @Field({ nullable: true })
    serviceFee?: number;

    @Field({ nullable: true })
    maxPartySize?: number;

    @Field({ nullable: true })
    reservationWindow?: number;

    @Field({ nullable: true })
    cancellationHours?: number;
}

@InputType()
export class RestaurantInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => AddressInput, { nullable: true })
    address?: AddressInput;

    @Field(() => ContactInput, { nullable: true })
    contact?: ContactInput;

    @Field(() => [String], { nullable: true })
    images?: string[];

    @Field(() => [String], { nullable: true })
    cuisine?: string[];

    @Field({ nullable: true })
    priceRange?: string;

    @Field(() => [String], { nullable: true })
    features?: string[];

    @Field(() => RestaurantSettingsInput, { nullable: true })
    settings?: RestaurantSettingsInput;

    @Field(() => [BusinessHoursInput], { nullable: true })
    businessHours?: BusinessHoursInput[];

    @Field(() => [PolicyInput], { nullable: true })
    policies?: PolicyInput[];
}

@InputType()
export class SalonSettingsInput {
    @Field({ nullable: true })
    currency?: string;

    @Field({ nullable: true })
    timezone?: string;

    @Field({ nullable: true })
    taxRate?: number;

    @Field({ nullable: true })
    serviceFee?: number;

    @Field({ nullable: true })
    cancellationHours?: number;
}

@InputType()
export class SalonInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => AddressInput, { nullable: true })
    address?: AddressInput;

    @Field(() => ContactInput, { nullable: true })
    contact?: ContactInput;

    @Field(() => [String], { nullable: true })
    images?: string[];

    @Field(() => [String], { nullable: true })
    specialties?: string[];

    @Field(() => SalonSettingsInput, { nullable: true })
    settings?: SalonSettingsInput;

    @Field(() => [BusinessHoursInput], { nullable: true })
    businessHours?: BusinessHoursInput[];

    @Field(() => [PolicyInput], { nullable: true })
    policies?: PolicyInput[];
}

@InputType()
export class LoginInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class RegisterInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    password: string;

    @Field()
    businessType: string;
}

@InputType()
export class UserUpdateInput {
    @Field({ nullable: true })
    businessId?: string;

    @Field({ nullable: true })
    businessType?: string;

    @Field({ nullable: true })
    role?: string;
}

@InputType()
export class AmenityInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    included: boolean;

    @Field({ nullable: true })
    price?: number;

    @Field({ nullable: true })
    category?: string;
}

@InputType()
export class BusinessServiceInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    price: number;

    @Field({ nullable: true })
    available?: boolean;

    @Field({ nullable: true })
    category?: string;
}
