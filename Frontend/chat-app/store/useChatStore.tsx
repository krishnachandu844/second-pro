import { MessageType, SelectedUserType } from "@/Types/types";
import axios from "axios";
import { create } from "zustand";
import Cookies from "js-cookie";

const token = Cookies.get("token");

interface ChatStoreStype {
  onlineUsers: string[];
  messages: MessageType[];
  selectedUser: null | SelectedUserType;
  setSelectedUser: (data: SelectedUserType) => void;
  setOnlineUsers: (data: string[]) => void;
  setMessages: (data: MessageType) => void;
  sendMessage: (data: MessageType) => void;
  getMessages: (roomId: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStoreStype>((set, get) => ({
  onlineUsers: [],
  messages: [],
  selectedUser: null,
  setSelectedUser: (data) => set({ selectedUser: data }),
  setOnlineUsers: (data) => set({ onlineUsers: data }),
  setMessages: (data) => set({ messages: [...get().messages, data] }),
  async sendMessage(data: MessageType) {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/send`,
        {
          message: data.message,
          senderId: data.senderId,
          receiverId: data.receiverId,
          roomId: data.roomId,
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
  },
  async getMessages(roomId: string) {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chats/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      set({ messages: [...res.data.messages] });
    } catch (error) {
      console.log(error);
    }
  },
  clearMessages() {
    set({ messages: [] });
  },
}));
