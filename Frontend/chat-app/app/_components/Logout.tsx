"use client";
import { Button } from "@/components/ui/button";
import { cleanWebSocketClient } from "@/lib/server/singleTonWebSocket";
import Cookies from "js-cookie";

export default function Logout() {
  return (
    <Button
      onClick={() => {
        Cookies.remove("token");
        cleanWebSocketClient();
        window.location.href = "/signin";
      }}
    >
      Logout
    </Button>
  );
}
