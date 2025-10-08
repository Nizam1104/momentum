"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsNavigation() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("today");
  const router = useRouter();

  // Initialize tab from search params
  useEffect(() => {
    const tabId = searchParams.get('tab') || 'today';
    setActiveTab(tabId);
  }, [searchParams]);

  const handleTabChange = function(tabId: string) {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.replace(`dashboard?${params.toString()}`);
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="learning">Learning</TabsTrigger>
        <TabsTrigger value="roads">Roads</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}