import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
      require: true,
    },
    lastMessage: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const messageSchema = new mongoose.Schema(
  {
    message: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
export const Room = mongoose.model("Room", roomSchema);
export const Message = mongoose.model("Message", messageSchema);
