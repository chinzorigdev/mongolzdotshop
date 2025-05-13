import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  title: string;
  price: number;
  size: string;
  quantity: number;
  nameOnJersey?: string;
}

export interface ICustomer {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: ICustomer;
  items: IOrderItem[];
  total: number;
  shippingFee: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "bankTransfer";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
  },
  items: [
    {
      productId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      nameOnJersey: {
        type: String,
        default: "",
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  shippingFee: {
    type: Number,
    required: true,
    default: 6000,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["bankTransfer"],
    default: "bankTransfer",
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

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
