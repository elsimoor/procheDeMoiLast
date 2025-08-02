"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const restaurantSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Restaurant', restaurantSchema);
//# sourceMappingURL=RestaurantModel.js.map