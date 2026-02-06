import { MessageType, SelectedUserType } from "@/Types/types";
import { create } from "zustand";

interface ChatStoreStype {
  onlineUsers: string[];
  messages: MessageType[];
  selectedUser: null | SelectedUserType;
  setSelectedUser: (data: SelectedUserType) => void;
  setOnlineUsers: (data: string[]) => void;
  setMessages: (data: MessageType) => void;
}

export const useChatStore = create<ChatStoreStype>((set, get) => ({
  onlineUsers: [],
  messages: [],
  selectedUser: null,
  setSelectedUser: (data) => set({ selectedUser: data }),
  setOnlineUsers: (data) => set({ onlineUsers: data }),
  setMessages: (data) => set({ messages: [...get().messages, data] }),
}));
