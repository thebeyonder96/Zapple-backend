import express from "express";
import cors from "cors";
import { sampleTags, sample_foods, sample_users } from "./data";
import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";
import orderRouter from "./routers/order.router";
import adminRouter from "./routers/admin.router";
import wishRouter from "./routers/wishlist.router";
const bodyParser = require("body-parser");

import dotenv from "dotenv";
dotenv.config();
import { dbConnect } from "./configs/database.config";
import { checkout } from "./routers/check.out";
dbConnect();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/checkout", checkout);
app.use("/admin", adminRouter);
app.use("/wish", wishRouter);

const port = 5000;
app.listen(port, () => console.log("connected" + port));
