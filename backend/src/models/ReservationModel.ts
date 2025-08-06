import mongoose, { Schema, Document } from 'mongoose';

interface ReservationDocument extends Document {
  restaurantId?: mongoose.Types.ObjectId;
  hotelId?: mongoose.Types.ObjectId;
  salonId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  roomId?: mongoose.Types.ObjectId;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  tableId?: mongoose.Types.ObjectId;
  partySize?: number;
  serviceId?: mongoose.Types.ObjectId;
  staffId?: mongoose.Types.ObjectId;
  date: Date;
  time?: string;
  duration?: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  totalAmount?: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  specialRequests?: string;
  reminderSent: boolean;
  source: 'website' | 'phone' | 'walk-in' | 'admin';
}

const reservationSchema = new Schema<ReservationDocument>({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
  },
  salonId: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  customerInfo: {
    name: { type: String,  },
    email: { type: String,  },
    phone: { type: String,  }
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  tableId: {
    type: Schema.Types.ObjectId,
    ref: 'Table'
  },
  partySize: Number,
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  date: { type: Date,  },
  time: String,
  duration: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  totalAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: String,
  specialRequests: String,
  reminderSent: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'walk-in', 'admin', 'new-ui'],
    default: 'website'
  }
}, {
  timestamps: true
});

export default mongoose.model<ReservationDocument>('Reservation', reservationSchema);