import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import authRoutes from "./routes/auth.js";
import storeRoutes from "./routes/store.js";
import gameCopyRoutes from "./routes/gameCopy.js";
import gameRoutes from "./routes/game.js";
import collectionRoutes from "./routes/collection.js";
import wishlistRoutes from "./routes/wishlist.js";
import reviewRoutes from "./routes/review.js";
import userRoutes from "./routes/user.js"
import notificationRoutes from "./routes/notification.js"

const app = express();



app.use(express.json());
dotenv.config();
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   next();
// });

app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/gameCopy", gameCopyRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notification", notificationRoutes);


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection succesful"))
  .catch((err) => console.log(err));

app.listen(
  9000,
  //  process.env.IP_ADDRESS,
  () => {
    console.log("Backend server is running");
  }
);
