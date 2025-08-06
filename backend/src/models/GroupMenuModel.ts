import mongoose, { Schema, Document } from 'mongoose';

interface GroupMenuDocument extends Document {
  name: string;
  courses: number;
  pricePerPerson: number;
  restaurantId: mongoose.Types.ObjectId;
}

const groupMenuSchema = new Schema<GroupMenuDocument>({
  name: {
    type: String,
    required: true,
  },
  courses: {
    type: Number,
    required: true,
  },
  pricePerPerson: {
    type: Number,
    required: true,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
});

export default mongoose.model<GroupMenuDocument>('GroupMenu', groupMenuSchema);
