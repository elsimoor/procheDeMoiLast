import mongoose, { Schema, Document } from 'mongoose';

interface BusinessHours extends Document {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface Policy extends Document {
  title: string;
  description: string;
  category: string;
}

interface RestaurantDocument extends Document {
  clientId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  settings: {
    currency: string;
    timezone: string;
    taxRate: number;
    serviceFee: number;
    maxPartySize: number;
    reservationWindow: number;
    cancellationHours: number;
    horaires: { ouverture: string; fermeture: string }[];
    capaciteTotale: number;
    tables: { size2: number; size4: number; size6: number; size8: number };
    frequenceCreneauxMinutes: number;
    maxReservationsParCreneau: number;
    capaciteTheorique: number;
  };
  businessHours: BusinessHours[];
  cuisine: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  features: string[];
  policies: Policy[];
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
}

const restaurantSchema = new Schema<RestaurantDocument>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  settings: {
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    taxRate: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    maxPartySize: { type: Number, default: 10 },
    reservationWindow: { type: Number, default: 60 },
    cancellationHours: { type: Number, default: 2 },
    horaires: [{
      ouverture: String,
      fermeture: String
    }],
    capaciteTotale: { type: Number, default: 0 },
    tables: {
      size2: { type: Number, default: 0 },
      size4: { type: Number, default: 0 },
      size6: { type: Number, default: 0 },
      size8: { type: Number, default: 0 }
    },
    frequenceCreneauxMinutes: { type: Number, default: 30 },
    maxReservationsParCreneau: { type: Number, default: 10 },
    capaciteTheorique: { type: Number, default: 0 }
  },
  businessHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    isOpen: { type: Boolean, default: true },
    openTime: String,
    closeTime: String
  }],
  cuisine: {
    type: [String],
    default: []
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  features: [String],
  policies: [{
    title: String,
    description: String,
    category: String
  }],
  images: [String],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<RestaurantDocument>('Restaurant', restaurantSchema);