import User from "../models/User.js";
import Wishlist from "../models/Wishlist.js";
import { searchGameCopiesBestPrice } from "./gameCopy-controller.js";
import { sendNotification } from "./notification-controller.js";
import bcrypt from "bcrypt";

export const notifyUsers = async (req, res) => {
  try {
    const users = await User.find();
    const userIds = users.map((user) => user._id);
    for (const userId of userIds) {
      const wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) continue;
      for (const game of wishlist.games) {
        const bestPriceCopy = await searchGameCopiesBestPrice(
          req,
          res,
          game.gameTitle
        );

        // if (bestPriceCopy.retailPrice[0].price === game.lowestPriceAdded) {
        //   continue;
        // } else {
        game.lowestPriceAdded = bestPriceCopy.retailPrice[0].price;
        game.storeAdded = bestPriceCopy.storeName;
        const notificationPrice = bestPriceCopy.retailPrice[0].price;
        const notificationStore = bestPriceCopy.storeName;
        const notificationGameTitle = game.gameTitle;
        const notificationGameSlug = game.gameSlug;
        await sendNotification(
          req,
          res,
          userId,
          notificationPrice,
          notificationGameTitle,
          notificationStore,
          notificationGameSlug
        );
        // }
      }
      await wishlist.save();
    }
    res.status(200).json({ message: "Done Updating Prices" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const { username, email, profilePicture } = user;
    res.status(200).json({ username, email, profilePicture });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUserInfo = async (req, res) => {
  const userId = req.params.userId;
  const newInfo = req.body.newInfo;
  const { newUsername, newEmail, newPassword } = newInfo;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (newUsername) {
      console.log("has user name");
      const existedUsername = await User.findOne({ username: newUsername });
      if (existedUsername)
        return res.json({ type: "error", message: "Username existed" });
      user.username = newUsername;
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    if (newEmail) {
      const existedEmail = await User.findOne({ email: newEmail });
      if (existedEmail)
        return res.json({ type: "error", message: "Email existed" });
      user.email = newEmail;
    }
    await user.save();
    res
      .status(200)
      .json({ type: "success", message: "User Info Updated Successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUsersNumbers = async (req, res) => {
  try {
    const users = await User.find().count();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserEachMonth = async (req, res) => {
  try {
    const userCreations = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          count: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);

    res.json(userCreations);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    user.isDisabled = !user.isDisabled;
    await user.save();
    res.status(200).json({ type: "success", message: "Status changed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUsersByUsernameOrEmail = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page);
    const usersPerPage = parseInt(req.query.usersPerPage);

    const skipCount = (page - 1) * usersPerPage;
    let userQuery = {};

    if (query) {
      userQuery = {
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      };
    }

    const users = await User.find(userQuery)
      .skip(skipCount)
      .limit(usersPerPage);

    if (users.length === 0) {
      res.json({ type: "error", message: "No users found", users: [] });
      return;
    }

    res.status(200).json({ type: "success", message: "Users found", users });
  } catch (error) {
    res.status(500).json(error);
  }
};

