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
    cancellationHours: { type: Number, default: 2 }
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