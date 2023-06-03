import { Router } from "express";
import { sampleTags, sample_foods } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";
import { verifyAdmin } from "../middlewares/auth.mid";
import { ObjectId } from "mongodb";
import { upload } from "../middlewares/upload";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

const router = Router();
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CloudName,
  api_key: process.env.CloudAPIKey,
  api_secret: process.env.CloudAPISecret,
});

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

router.post(
  "/add",
  verifyAdmin,
  asyncHandler(async (req: any, res: any) => {
    const item = req.body;
    const food = new FoodModel({
      name: item.name,
      price: item.price,
      tags: item.tags,
      cookTime: item.cookTime,
      imageUrl: item.image,
    });

    try {
      const newFood = await food.save();
      if (!newFood) return res.status(400).send("Unable to add");
      res.status(200).json(newFood);
    } catch (error) {
      res.status(500).send(error);
    }
  })
);

router.delete(
  "/delete/:id",
  verifyAdmin,
  asyncHandler(async (req: any, res: any) => {
    try {
      const deleted = await FoodModel.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(400).send("Unable to delete");
      res.status(200).json(deleted);
    } catch (error) {
      res.send(error);
    }
  })
);

router.put(
  "/update/:id",
  verifyAdmin,
  upload.single("file"),
  asyncHandler(async (req: any, res: any) => {
    console.log(req.body.image);

    try {
      // if(!req.file) throw 'File not found'
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "Foods",
      });
      console.log(result);

      const filter = { _id: new ObjectId(req.params.id) };
      const update = {
        name: req.body.name,
        price: req.body.price,
        tags: req.body.tags,
        image: req.body.image,
        cookTime: req.body.cookTime,
      };
      const updated = await FoodModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      if (!updated) return res.status(400).send("Unable to update");
      res.status(200).json(updated);
    } catch (error) {
      res.send(error);
    }
  })
);
export default router;
