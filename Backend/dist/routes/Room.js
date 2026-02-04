import express from "express";
import { authMiddleWare } from "../middleware.js";
import { Room } from "../schema.js";
const router = express.Router();
router.post("/createRoom", authMiddleWare, async (req, res) => {
    const { roomId } = req.body;
    const userId = req.userId;
    try {
        const isRoomExists = await Room.findOne({ roomId });
        if (isRoomExists) {
            return res.status(200).json({ message: "Room already Exists" });
        }
        const room = await Room.create({
            roomId,
            userId,
        });
        if (room) {
            return res.status(200).json({ message: "Room Created Succesfully" });
        }
        else
            return res.status(404).json({ message: "Unable to create Room" });
    }
    catch (error) {
        console.log(error);
    }
});
export default router;
//# sourceMappingURL=room.js.map