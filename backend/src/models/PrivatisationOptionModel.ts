import mongoose, { Schema, Document } from 'mongoose';

// Interface for the document
interface PrivatisationOptionDocument extends Document {
  nom: string;
  description?: string;
  type: string;
  capaciteMaximale: number;
  dureeMaximaleHeures: number;
  menusDeGroupe: string[];
  restaurantId: mongoose.Schema.Types.ObjectId;
}

// Schema definition
const privatisationOptionSchema = new Schema<PrivatisationOptionDocument>({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  capaciteMaximale: {
    type: Number,
    required: true
  },
  dureeMaximaleHeures: {
    type: Number,
    required: true
  },
  menusDeGroupe: {
    type: [String],
    default: []
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
}, {
  timestamps: true
});

// Model export
export default mongoose.model<PrivatisationOptionDocument>('PrivatisationOption', privatisationOptionSchema);
