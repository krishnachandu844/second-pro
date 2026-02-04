"use client";
import { useChatStore } from "@/store/useChatStore";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

export default function useSocket() {
  // const socket = useRef<WebSocket | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);
  const token = Cookies.get("token");

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

    ws.onopen = () => {
      console.log("Socket Connected");
      // socket.current = ws;
      // setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (e) => {
      const parseData = JSON.parse(e.data);
      switch (parseData.type) {
        case "activeUsers":
          setOnlineUsers(parseData.onlineUsers);
          break;
      }
    };

    ws.onclose = () => {
      console.log("🔌 Socket Disconnected");
      // socket.current = null;
      setSocket(null);
    };
  }, []);

  return socket;
}
