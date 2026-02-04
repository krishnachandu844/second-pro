import ChatPlayground from "@/app/_components/ChatPlayground";
import UsersList from "@/app/_components/UsersList";

export default function Home() {
  return (
    <div className='min-h-screen flex bg-accent p-5 gap-x-4'>
      <UsersList />
      <ChatPlayground />
    </div>
  );
}
