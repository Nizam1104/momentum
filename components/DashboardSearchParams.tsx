"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DayComponent from "@/components/days/Day";
import ProjectManagement from "@/components/project-management/ProjectManagement";
import LearningManagement from "@/components/learning/LearningManagement";
import { useDayStore } from "@/stores/day";

export default function DashboardTabs() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("today");
  const router = useRouter();
  const { selectedDay } = useDayStore();

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
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        handleTabChange(value)
      }}
      className="space-y-4"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="learning">Learning</TabsTrigger>
      </TabsList>

      <TabsContent value="today" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-1">
            <DayComponent day={selectedDay} isToday={true} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        <div className="h-[calc(100vh-200px)]">
          <ProjectManagement />
        </div>
      </TabsContent>

      <TabsContent value="learning" className="space-y-4">
        <div className="h-[calc(100vh-200px)]">
          <LearningManagement />
        </div>
      </TabsContent>
    </Tabs>
  );
}