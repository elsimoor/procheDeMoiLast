import mongoose, { Schema, Document } from 'mongoose';

interface ReservationDocument extends Document {
  businessId: mongoose.Types.ObjectId;
  businessType: 'hotel' | 'restaurant' | 'salon';
  customerId?: mongoose.Types.ObjectId;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  date: Date;
  time?: string;
  partySize?: number;
  duration?: number;
  tableId?: mongoose.Types.ObjectId;
  roomId?: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  staffId?: mongoose.Types.ObjectId;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  specialRequests?: string;
  totalAmount?: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  source: 'online' | 'phone' | 'walk-in';
  reminderSent: boolean;
  isPrivatization: boolean;
  privatizationOptionId?: mongoose.Types.ObjectId;
}

const reservationSchema = new Schema<ReservationDocument>({
  businessId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'businessType'
  },
  businessType: {
    type: String,
    required: true,
    enum: ['Hotel', 'Restaurant', 'Salon']
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  partySize: Number,
  duration: Number,
  tableId: {
    type: Schema.Types.ObjectId,
    ref: 'Table'
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  specialRequests: String,
  totalAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['online', 'phone', 'walk-in'],
    default: 'online'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  isPrivatization: {
    type: Boolean,
    default: false,
  },
  privatizationOptionId: {
    type: Schema.Types.ObjectId,
    ref: 'PrivatizationOption',
  },
}, {
  timestamps: true
});

export default mongoose.model<ReservationDocument>('Reservation', reservationSchema);