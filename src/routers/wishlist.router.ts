import express from "express";
import AsyncHandler from "express-async-handler";
import { WishListModel } from "../models/wishlist.model";
import { FoodModel } from "../models/food.model";
import { ObjectId } from "mongodb";
const router = express.Router();

router.post(
  "/add/:userId/:id",
  AsyncHandler(async (req: any, res: any) => {
    try {
      const food = await FoodModel.findById(req.params.id);
      console.log(food);
      const check = await WishListModel.findOne({ id: food?.id });
      console.log(check);

      if (!food) return res.status(400).send("No food found");
      const wishlist = new WishListModel({
        userId: req.params.userId,
        wishList: food,
      });
      console.log(wishlist);
      if (!wishlist) return res.status(400).send("Wishlist error");
      const newWish = await wishlist.save();
      if (!newWish) return res.status(400).send("unable to create wishlist");
      res.status(200).send(newWish);
    } catch (error) {
      res.send(error);
    }
  })
);

export default router;
