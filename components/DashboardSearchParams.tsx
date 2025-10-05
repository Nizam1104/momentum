"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DayComponent from "@/components/days/Day";
import ProjectManagement from "@/components/project-management/ProjectManagement";
import LearningManagement from "@/components/learning/LearningManagement";
import { useDayStore } from "@/stores/day";

export default function DashboardTabs() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'today';
  const { selectedDay } = useDayStore();

  return (
    <Tabs
      value={activeTab}
      className="space-y-4"
    >
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