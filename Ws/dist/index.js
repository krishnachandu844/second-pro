import WebSocket, { WebSocketServer } from "ws";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const wss = new WebSocketServer({ port: 8080 });
const rooms = [];
let onlineUsers = [];
const broadCastOnlineUsers = () => {
    const users = onlineUsers.map((user) => user.userId);
    const uniqueUsers = [...new Set(users)];
    const payload = JSON.stringify({
        type: "activeUsers",
        onlineUsers: uniqueUsers,
    });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
};
wss.on("connection", function connection(ws, req) {
    let currentUserId = "";
    try {
        const url = req.url;
        const queryParams = new URLSearchParams(url?.split("?")[1]);
        const token = queryParams.get("token");
        if (!token) {
            console.log("Invalid User");
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.userId;
        onlineUsers.push({ userId: currentUserId });
    }
    catch (error) {
        console.log(error);
    }
    ws.on("message", function message(data) {
        const ParsedData = JSON.parse(data);
        switch (ParsedData.type) {
            case "status-update":
                broadCastOnlineUsers();
                break;
            case "join":
                rooms.push({
                    socket: ws,
                    roomId: ParsedData.roomId,
                });
                break;
            case "chat":
                const room = rooms.filter((r) => r.roomId == ParsedData.roomId);
                room.map((r) => {
                    if (r.roomId == ParsedData.roomId && r.socket != ws) {
                        r.socket.send(JSON.stringify({
                            type: "message",
                            senderId: currentUserId,
                            receiverId: ParsedData.receiverId,
                            roomId: ParsedData.roomId,
                            message: ParsedData.message,
                        }));
                    }
                });
                break;
            default:
                break;
        }
    });
    ws.on("close", () => {
        onlineUsers = onlineUsers.filter((u) => u.userId !== String(currentUserId));
        broadCastOnlineUsers();
    });
});
//# sourceMappingURL=index.js.map