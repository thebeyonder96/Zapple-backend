import mongoose, { model, Schema, Types } from "mongoose";
import { Food, foodSchema } from "./food.model";
import { orderStatusEnum } from "../constants/order_status";

export interface LatLng {
  lat: string;
  lng: string;
}

export const latlngSchema = new Schema<LatLng>({
  lat: { type: String, required: true },
  lng: { type: String, required: true },
});

export interface orderItem {
  food: Food;
  price: number;
  quantity: number;
}

export const orderItemSchema = new Schema<orderItem>({
  food: { type: foodSchema, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

export interface Order {
  id: string;
  items: orderItem[];
  totoalPrice: number;
  name: string;
  address: string;
  addressLatLng: LatLng;
  paymentId: string;
  status: orderStatusEnum;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const orderSchema = new Schema<Order>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: latlngSchema, required: true },
    paymentId: { type: String },
    totoalPrice: { type: Number, required: true },
    items: { type: [orderItemSchema], required: true },
    status: { type: String, default: orderStatusEnum.NEW },
    user: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const orderModel = mongoose.model("Order", orderSchema);
