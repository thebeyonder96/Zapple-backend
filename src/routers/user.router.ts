import { Router } from "express";
import jwt from "jsonwebtoken";
import { sample_users } from "../data";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { FoodModel } from "../models/food.model";
import bcrypt from "bcrypt";

const router = Router();

// Login Section

// router.get(
//   "/seed",
//   asyncHandler(async (req, res) => {
//     const userCount = await UserModel.countDocuments();
//     if (userCount > 0) {
//       res.send("already seeded");
//       return;
//     }

//     await UserModel.create(sample_users);
//     res.send("seeded");
//   })
// );

router.post(
  "/login",
  asyncHandler(async (req, res: any) => {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(400).send("User not found");
      const compare = await bcrypt.compare(password, user!.password);
      if (!compare) return res.status(400).send("Incorrect password");
      if (compare) {
        res.send(generateToken(user));
      }
    } catch (error) {
      res.status(400).send(error);
    }
    // res.status(400).send("Username or Password is invalid");
  })
);

router.post(
  "/register",
  asyncHandler(async (req: any, res: any) => {
    const { name, email, password, address } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).send("Email already exist , please login");
    }

    const encryptedPass = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: encryptedPass,
      address,
      isAdmin: false,
    };
    const dbUser = await UserModel.create(newUser);
    res.send(generateToken(dbUser));
  })
);

const generateToken = (user: any) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    "Akshay",
    { expiresIn: "30d" }
  );
  // console.log(user);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token: token,
  };
};

export default router;
