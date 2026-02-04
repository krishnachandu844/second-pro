import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import user from "./routes/user.js";
import room from "./routes/room.js";
import message from "./routes/message.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || "3000";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", user);
app.use("/api/v1", room);
app.use("/api/v1", message);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server Started at ${PORT}`);
});
