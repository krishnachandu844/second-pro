"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSocket from "@/hooks/useSocket";
import { useWebSocket } from "@/hooks/useWebSocket";
import { cn } from "@/lib/utils";
import MessageSpinner from "@/Spinners/MessageSpinner";
import Loader from "@/Spinners/TailSpin";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import { Separator } from "@radix-ui/react-separator";
import {
  Divide,
  EllipsisIcon,
  PhoneCallIcon,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";

interface MessageType {
  type: "client" | "server";
  message: string;
}

export default function ChatPlayground() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const user = useUserStore((state) => state.user);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const { client } = useWebSocket();
  const ws = client?.socket;

  const roomId = [user?.username, selectedUser].sort().join("_");

  // const onClicksendMessage = () => {
  //   if (!socket && !message.trim()) return;
  //   if (socket) {
  //     socket.send(
  //       JSON.stringify({
  //         type: "chat",
  //         roomId,
  //         message,
  //       }),
  //     );
  //   }
  //   setMessages((prev) => [...prev, { type: "client", message }]);
  //   setMessage("");
  // };

  //Sending Status Update
  useEffect(() => {
    if (ws && ws.readyState == WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "status-update",
        }),
      );
    }
  }, [ws]);

  //Sending Join Room
  // useEffect(() => {
  //   if (socket && selectedUser && user) {
  //     socket.send(
  //       JSON.stringify({
  //         type: "join",
  //         roomId,
  //       }),
  //     );
  //   }
  // }, [socket, roomId]);

  // useEffect(() => {
  //   if (!ws) return;

  //   ws.onmessage = (e) => {
  //     // setMessages((prev) => [...prev, { type: "server", message: e.data }]);

  //     const parsedData = JSON.parse(e.data);
  //     switch (parsedData.type) {
  //     }
  //   };

  //   return () => {
  //     ws.onmessage = null;
  //   };
  // }, [ws]);

  if (ws == null) {
    return (
      <div className='bg-card w-full rounded-md flex-1 flex flex-col items-center justify-center ml-auto'>
        <Loader />
      </div>
    );
  }

  return selectedUser ? (
    <div className=' flex-1 font-sans'>
      <div className='shadow-lg bg-card rounded-xl h-full w-full flex flex-col'>
        {/* Chat Header */}
        <div className='flex items-center p-4  border-b justify-between'>
          <div className='flex gap-x-4 items-center'>
            <Avatar className='w-10 h-10'>
              <AvatarFallback className='font-bold'>
                {selectedUser[0]}
              </AvatarFallback>
            </Avatar>
            <h1 className='text-xl font-semibold '>{selectedUser}</h1>
          </div>
          <div className='flex items-center gap-x-6'>
            <Button variant={"secondary"}>
              <PhoneCallIcon />
            </Button>
            <Button variant={"secondary"}>
              <Video size={46} />
            </Button>
            <EllipsisIcon />
          </div>
        </div>
        <Separator />
        {/* ChatPlayground */}
        <div className='flex-1 p-4'>
          {messages.map((m, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col p-3 m-2 w-fit rounded-md",
                m.type == "client" && "bg-primary ml-auto text-white",
                m.type == "server" && "",
              )}
            >
              {m.type == "server" ? (
                <div className='flex items-center -ml-6'>
                  <Avatar className='w-8 h-8'>
                    <AvatarFallback className='font-bold'>
                      {selectedUser[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className='bg-secondary p-3 m-2 w-fit rounded-md'>
                    {m.message}
                  </p>
                </div>
              ) : (
                <p>{m.message}</p>
              )}
            </div>
          ))}
        </div>
        {/* SendMessage */}
        <div className='p-4 flex gap-x-2 items-center border-t'>
          <Smile className='cursor-pointer' />
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                // onClicksendMessage();
              }
            }}
          />
          {/* <Button onClick={onClicksendMessage}>
            <Send />
          </Button> */}
        </div>
      </div>
    </div>
  ) : (
    <div className='bg-card w-full rounded-md flex-1 flex flex-col items-center justify-center ml-auto'>
      <MessageSpinner />
      <h1 className='font-sans font-bold text-xl'>
        Click On Any User to Start Conversation
      </h1>
    </div>
  );
}
