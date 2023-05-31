import { Router } from "express";
import authMid from "../middlewares/auth.mid";
import asyncHandler from "express-async-handler";
import { orderModel } from "../models/order.model";
import { orderStatusEnum } from "../constants/order_status";
const router = Router();

router.use(authMid);

router.post(
  "/create",
  asyncHandler(async (req: any, res) => {
    const requestOrder = req.body;

    if (requestOrder.items.length <= 0) {
      res.status(400).send("Cart is empty");
      return;
    }

    await orderModel.deleteOne({
      user: req.user.id,
      status: orderStatusEnum.NEW,
    });

    const newOrder: any = new orderModel({
      ...requestOrder,
      user: req.user.id,
    });
    await newOrder.save();
    res.status(200).send(newOrder);
  })
);

router.get(
  "/order",
  asyncHandler(async (req: any, res) => {
    try {
      const order = await orderModel.findOne({
        user: req.user.id,
        status: orderStatusEnum.NEW,
      });

      if (!order) res.status(400).send("Order not found");
      res.status(200).send(order);
    } catch (error) {
      res.send(error);
    }
  })
);

router.get(
  "/track/:id",
  asyncHandler(async (req, res) => {
    const order = await orderModel.findById(req.params.id);
    res.send(order);
  })
);

export default router;
