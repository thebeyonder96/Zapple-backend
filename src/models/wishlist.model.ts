import { Schema, model } from "mongoose";
import { Food } from "./food.model";

export interface WishList {
  id: string;
  userId: string;
  wishList: Food[];
}

export const wishListSchema = new Schema<WishList>(
  {
    userId: { type: String, required: true },
    wishList: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          tags: { type: [String] },
          favorite: { type: Boolean, default: false },
          imageUrl: { type: String, required: true },
          origins: { type: [String], required: true },
          cookTime: { type: String, required: true },
        },
      ],
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const WishListModel = model<WishList>("Wishlist", wishListSchema);
