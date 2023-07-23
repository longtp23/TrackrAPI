import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  // check email
  const emailExisted = await User.findOne({ email: req.body.email });
  const usernameExisted = await User.findOne({ username: req.body.username });
  if (emailExisted) {
    return res.json({type:"error",message:"Email already existed"});
  }
  if (usernameExisted) {
    return res.json({type:"error",message:"Username already existed"});
  }
  try {
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // new user
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
      profilePicture: `https://robohash.org/${req.body.username}`,
    });
    await newUser.save();
    res.status(200).json({type:"success", message:"Register successful!"});
  } catch (err) {
    res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  try {
    // check user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({type:"error", message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(200).json({type:"error", message: "Wrong Credentials" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const checkPassword = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.json({ type: "error", message: "Wrong Password!" });
    else
      return res
        .status(200)
        .json({ type: "success", message: "You Are Authorized!" });
  } catch (error) {
    res.status(500).json(error);
  }
};
