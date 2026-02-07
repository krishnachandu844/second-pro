import WebSocketClient from "@/src/class/socket.client";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { getWebSocketClient } from "@/lib/server/singleTonWebSocket";
import { useChatStore } from "@/store/useChatStore";

export const useWebSocket = () => {
  const socket = useRef<WebSocketClient | null>(null);
  const token = Cookies.get("token");

  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);
  const setMessages = useChatStore((state) => state.setMessages);
  const sendMessage = useChatStore((state) => state.sendMessage);

  useEffect(() => {
    if (!token) return;

    socket.current = getWebSocketClient(token!);
    const ws = socket.current?.socket;
    if (!ws) return;

    const handler = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);
        switch (parsed.type) {
          case "activeUsers":
            setOnlineUsers(parsed.onlineUsers);
            break;
          case "message":
            setMessages(parsed);
            sendMessage(parsed);
            break;
        }
      } catch {
        console.log("Error");
      }
    };
    ws?.addEventListener("message", handler);

    return () => {
      ws?.removeEventListener("message", handler);
    };
  }, [token]);

  return { client: socket.current };
};
