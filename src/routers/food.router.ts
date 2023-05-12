import { Router } from "express";
import { sampleTags, sample_foods } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const foodCount = await FoodModel.countDocuments();
    if (foodCount > 0) {
      res.send("already seeded");
      return;
    }

    await FoodModel.create(sample_foods);
    res.send("seeded");
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

router.get(
  "/search/:searchTerm",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.get(
  "/tags",
  asyncHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);
    res.send(tags);
  })
);

router.get(
  "/tags/:tag",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params.tag });
    res.send(foods);
  })
);

router.get(
  "/:foodId",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.findById(req.params.foodId);
    res.send(foods);
  })
);

export default router;
