import { create } from "zustand";

interface ChatStoreStype {
  onlineUsers: string[];
  selectedUser: null | string;
  setSelectedUser: (data: string) => void;
  setOnlineUsers: (data: string[]) => void;
}

export const useChatStore = create<ChatStoreStype>((set, get) => ({
  onlineUsers: [],
  selectedUser: null,
  setSelectedUser: (data) => set({ selectedUser: data }),
  setOnlineUsers: (data) => set({ onlineUsers: data }),
}));
