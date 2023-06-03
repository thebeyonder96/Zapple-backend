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
      const check = await WishListModel.findOne({
        userId: req.params.userId,
        "wishList._id": req.params.id,
      });
      if (check) return res.status(400).send("Item already in Wishlist");
      const wishlist = new WishListModel({
        userId: req.params.userId,
        wishList: food,
      });
      if (!wishlist) return res.status(400).send("Wishlist error");
      const newWish = await wishlist.save();
      if (!newWish) return res.status(400).send("unable to create wishlist");
      res.status(200).send(newWish);
    } catch (error) {
      res.send(error);
    }
  })
);

router.get(
  "/all/:userId",
  AsyncHandler(async (req: any, res: any) => {
    try {
      const wishList = await WishListModel.find({ userId: req.params.userId });
      if (!wishList) return res.status(400).send("No wishlist found");
      res.status(200).send(wishList);
    } catch (error) {
      res.send(error);
    }
  })
);

router.delete(
  "/delete/:userId/:id",
  AsyncHandler(async (req: any, res: any) => {
    try {
      const wish = await WishListModel.deleteOne({
        userId: req.params.userId,
        "wishList._id": req.params.id,
      });

      if (!wish) return res.status(400).send("Unable to delete");
      res.status(200).json(wish);
    } catch (error) {
      res.send(error);
    }
  })
);

router.delete(
  "/clear/:userId",
  AsyncHandler(async (req: any, res: any) => {
    const clearWish = await WishListModel.deleteMany({
      userId: req.params.userId,
    });
    if (!clearWish) return res.status(400).send("Unable to clear");
    res.status(200).json(clearWish);
  })
);

router.get("/");

export default router;
