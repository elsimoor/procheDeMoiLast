import { UserResolver } from './User';
import { ClientResolver } from './Client';
import { HotelResolver } from './Hotel';
import { RoomResolver } from './Room';
import { ServiceResolver } from './Service';
import { RestaurantResolver } from './Restaurant';
import { TableResolver } from './Table';
import { MenuItemResolver } from './MenuItem';
import { ReservationResolver } from './Reservation';
import { StaffResolver } from './Staff';
import { GuestResolver } from './Guest';
import { AllResolver } from './All';

export const resolvers = [
  UserResolver,
  ClientResolver,
  HotelResolver,
  RoomResolver,
  ServiceResolver,
  RestaurantResolver,
  TableResolver,
  MenuItemResolver,
  ReservationResolver,
  StaffResolver,
  GuestResolver,
  AllResolver,
] as const;
