"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "../../components/ModeToggle";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Loader from "@/Spinners/TailSpin";
import { useUserStore } from "@/store/useUserStore";
import { User } from "@/Types/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatStore } from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import Logout from "./Logout";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchMe = useUserStore((state) => state.fetchMe);
  const user = useUserStore((state) => state.user);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const token = Cookies.get("token");

  // Getting UsersList
  const getUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.usersList);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <div className='w-80 border-r bg-card rounded-md'>
      <div className='flex px-2 gap-x-2 border-b p-4'>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>{user?.username[0]}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent className='font-mono'>
            <h1 className='text-sm font-bold'>Username: {user?.username}</h1>
            <h1 className='text-sm font-bold'>Email: {user?.email}</h1>
            <Logout />
          </TooltipContent>
        </Tooltip>

        <Input className='bg-accent rounded-3xl' placeholder='Search...' />
        <ModeToggle />
      </div>
      {isLoading ? (
        <div className='flex items-center w-full mt-16 justify-center'>
          <Loader />
        </div>
      ) : (
        users.map((u, index) => (
          <div
            key={index}
            className={cn(
              `flex items-center gap-4 hover:bg-primary/40 border-b p-4 cursor-pointer transition-all duration-150`,
              selectedUser?.username == u.username && "bg-primary/80",
            )}
            onClick={() => {
              setSelectedUser({
                _id: u._id,
                username: u.username,
              });
            }}
          >
            <div className='relative'>
              <Avatar className='h-10 w-10'>
                <AvatarFallback className='bg-secondary font-bold '>
                  {u.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "h-3 w-3 rounded-md absolute right-0 bottom-0",
                  onlineUsers.includes(u._id) ? "bg-green-600" : "bg-red-600",
                )}
              />
            </div>

            <div>
              <h1 className='font-bold font-sans'>{u.username}</h1>
              {/* <p className='text-sm'>{u.lastMessage}</p> */}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
