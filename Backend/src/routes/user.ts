import express from "express";
import { User } from "../schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleWare } from "../middleware.js";
import { Types } from "mongoose";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const isUserExist = await User.findOne({ username });
    if (isUserExist) {
      return res.status(404).json({ message: "User Already Exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { userId: newUser._id.toString() },
      process.env.JWT_SECRET!!,
    );
    if (newUser) {
      return res.status(200).json({ message: "Signup Successfully", token });
    } else {
      return res.status(404).json({ message: "Error While Signingup" });
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "User Doesn't Exists" });
      return;
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password!);
    if (!isPasswordCorrect) {
      res.status(404).json({ message: "Incorrect Password" });
      return;
    }
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!!,
    );
    if (user) {
      return res.status(200).json({ message: "Signin Successfully", token });
    } else {
      return res.status(404).json({ message: "Error While Signin" });
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/users", authMiddleWare, async (req, res) => {
  const userId = req.userId;
  try {
    const usersList = await User.find({
      _id: { $ne: userId },
    })
      .select("-password")
      .populate("rooms");
    return res.status(200).json({ usersList });
  } catch (error) {
    console.log(error);
  }
});

router.get("/me", authMiddleWare, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
});

export default router;
