import express from "express";
import { authMiddleWare } from "../middleware.js";
import { Message, Room } from "../schema.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/send", authMiddleWare, async (req, res) => {
  const { roomId, message, senderId, receiverId } = req.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const room = await Room.findOne({ roomId }).session(session);
    if (!room) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Room doesn't exist" });
    }

    const createdMessage = await Message.create(
      [
        {
          roomId: room._id,
          senderId,
          receiverId,
          message,
        },
      ],
      { session },
    );

    await Room.findByIdAndUpdate(
      room._id,
      {
        lastMessage: message,
        lastMessageAt: new Date(),
      },
      {
        new: true,
        session,
      },
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Message sent successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/chats/:roomId", authMiddleWare, async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ message: "roomId is required" });
  }
  const room = await Room.findOne({ roomId });
  if (!room) {
    return res.status(400).json({ message: "Room Doesn't Exist" });
  }

  try {
    const messages = await Message.find({ roomId: room?._id });
    if (messages) {
      return res.status(200).json({ messages });
    } else {
      return res.status(200).json({ message: "Unable to get Messages" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
