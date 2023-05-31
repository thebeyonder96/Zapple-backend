import express from "express";
import AsyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";
import { verifyAdmin } from "../middlewares/auth.mid";
import { FoodModel } from "../models/food.model";
import { orderModel } from "../models/order.model";
const router = express.Router();

router.get(
  "/allUser",
  verifyAdmin,
  AsyncHandler(async (req: any, res: any) => {
    try {
      const users = await UserModel.find();
      if (!users) return res.status(400).send("Users not found");
      res.status(200).send(users);
    } catch (error) {
      res.send(error);
    }
  })
);

router.get(
  "/allFoods",
  verifyAdmin,
  AsyncHandler(async (req: any, res: any) => {
    try {
      const foods = await FoodModel.find();
      if (!foods) return res.status(400).send("Foods not found");
      res.status(200).send(foods);
    } catch (error) {
      res.send(error);
    }
  })
);

router.get(
  "/allOrders",
  verifyAdmin,
  AsyncHandler(async (req: any, res: any) => {
    try {
      const orders = await orderModel.find();
      if (!orders) return res.status(400).send("No order found");
      res.status(200).send(orders);
    } catch (error) {
      res.send(error);
    }
  })
);

export default router;
