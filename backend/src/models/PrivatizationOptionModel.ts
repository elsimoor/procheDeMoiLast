import mongoose, { Schema, Document } from 'mongoose';

interface PricingRule {
  dayPattern: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceFlat?: number;
  minSpend?: number;
  depositPercent?: number;
}

interface PrivatizationOptionDocument extends Document {
  name: string;
  description: string;
  type: string;
  maxCapacity: number;
  maxDurationHours: number;
  menuIds: mongoose.Types.ObjectId[];
  pricingRules: PricingRule[];
  blackoutDates: Date[];
  restaurantId: mongoose.Types.ObjectId;
}

const privatizationOptionSchema = new Schema<PrivatizationOptionDocument>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
  },
  maxDurationHours: {
    type: Number,
    required: true,
  },
  menuIds: [{
    type: Schema.Types.ObjectId,
    ref: 'GroupMenu',
  }],
  pricingRules: [{
    dayPattern: [String],
    dateRange: {
      start: Date,
      end: Date,
    },
    priceFlat: Number,
    minSpend: Number,
    depositPercent: Number,
  }],
  blackoutDates: [Date],
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
});

export default mongoose.model<PrivatizationOptionDocument>('PrivatizationOption', privatizationOptionSchema);
