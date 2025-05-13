import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  id: string;
  title: string;
  description: string;
  price: number;
  price_on_sale: number | null;
  image: string;
  sizes: string[];
  category?: string;
  inStock?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  price_on_sale: {
    type: Number,
    default: null,
  },
  image: {
    type: String,
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    default: "jersey",
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
