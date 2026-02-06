import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";
import { User } from "@/Types/types";

interface UserStoreType {
  user: User | null;
  fetchMe: () => void;
}

export const useUserStore = create<UserStoreType>((set) => ({
  user: null,
  fetchMe: async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ user: res.data.user });
    } catch (error) {
      console.log(error);
    }
  },
}));
