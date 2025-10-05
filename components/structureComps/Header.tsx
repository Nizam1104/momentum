import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import TabsNavigation from "./TabsNavigation";
import LightDark from "@/components/utils/LightDark";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 -b px-4 transition-transform duration-300 ease-in-out">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <div className="flex items-center justify-between w-full">
        <Link href="/">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">Momentum</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <TabsNavigation />
          <LightDark />
        </div>
      </div>
    </header>
  );
}
