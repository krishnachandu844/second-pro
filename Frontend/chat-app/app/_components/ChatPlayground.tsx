"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import useSocket from "@/hooks/useSocket";
import { useWebSocket } from "@/hooks/useWebSocket";
import { cn, formatTime } from "@/lib/utils";
import MessageSpinner from "@/Spinners/MessageSpinner";
import Loader from "@/Spinners/TailSpin";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { EllipsisIcon, PhoneCallIcon, Send, Smile, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

export default function ChatPlayground() {
  const [message, setMessage] = useState("");

  const user = useUserStore((s) => s.user);
  const selectedUser = useChatStore((s) => s.selectedUser);
  const messages = useChatStore((s) => s.messages);
  const setMessages = useChatStore((s) => s.setMessages);
  const getMessages = useChatStore((s) => s.getMessages);
  const clearMessages = useChatStore((s) => s.clearMessages);

  const { client } = useWebSocket();
  const ws = client?.socket;

  const token = Cookies.get("token");

  /*--------RoomId-------*/
  const roomId = useMemo(() => {
    if (!user || !selectedUser) return "";
    return [user.username, selectedUser.username].sort().join("_");
  }, [user, selectedUser]);

  const sendMessage = () => {
    if (!ws || !message.trim() || !user || !selectedUser) return;
    const payload = {
      type: "chat",
      senderId: user._id,
      receiverId: selectedUser._id,
      roomId,
      message,
      createdAt: new Date(),
    };
    ws.send(JSON.stringify(payload)); // WS
    const data = {
      senderId: user?._id!,
      receiverId: selectedUser?._id!,
      roomId,
      message,
      createdAt: new Date(),
    };
    setMessages(data);
    setMessage("");
  };

  //creating Room
  const createRoom = async () => {
    if (!roomId || !user) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/createRoom`,
        {
          roomId,
          userId: user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

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
  useEffect(() => {
    if (ws && selectedUser && user && roomId) {
      ws.send(
        JSON.stringify({
          type: "join",
          roomId,
        }),
      );
      createRoom();
    }
  }, [ws, roomId]);

  useEffect(() => {
    if (!roomId) return;
    getMessages(roomId);
    return () => clearMessages();
  }, [roomId]);

  if (!ws) {
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
                {selectedUser.username[0]}
              </AvatarFallback>
            </Avatar>
            <h1 className='text-xl font-semibold '>{selectedUser.username}</h1>
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
        <div className='flex-1 p-4 overflow-y-auto'>
          {messages.length === 0 ? (
            <div className='h-full flex items-center justify-center'>
              <h1 className='text-xl'>No Messages</h1>
            </div>
          ) : (
            messages.map((m, index) => {
              const isMe = String(m.senderId) === String(user?._id);

              return (
                <div
                  key={index}
                  className={cn(
                    "flex mb-2",
                    isMe ? "justify-end" : "justify-start",
                  )}
                >
                  {!isMe && (
                    <Avatar className='w-8 h-8 mr-2'>
                      <AvatarFallback className='font-bold'>
                        {selectedUser.username[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "px-4 py-2 max-w-[70%] rounded-xl text-sm",
                      isMe
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-secondary rounded-bl-none",
                    )}
                  >
                    <span>{m.message}</span>
                    <br />
                    <span
                      className={cn(
                        "text-[10px] self-end",
                        isMe ? "text-white/70" : "text-muted-foreground",
                      )}
                    >
                      {formatTime(m.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
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
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage}>
            <Send />
          </Button>
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
