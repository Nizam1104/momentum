"use client"
import DaysChain from "@/components/days/DaysChain";
import { useUserStore } from "@/stores/user";

export default function Home() {

  const userState = useUserStore().getUser()

  return (
    <div className="mt-4 w-full h-auto flex justify-center items-center">
      <div className="min-w-5xl max-w-7xl">
        <DaysChain />
      </div>
    </div>
  );
}
