// app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Import components
import DayComponent from "@/components/days/Day";
import ProjectManagement from "@/components/project-management/ProjectManagement";
import LearningManagement from "@/components/learning/LearningManagement";

// Import stores
import { useDayStore } from "@/stores/day";
import { useProjectStore } from "@/stores/project";
import { useLearningStore } from "@/stores/learning";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  // Store selectors
  const {
    selectedDay,
    initialLoading: dayLoading,
    error: dayError,
    fetchTodayEntry,
  } = useDayStore();

  const {
    projects,
    initialLoading: projectLoading,
    error: projectError,
    fetchProjects,
  } = useProjectStore();

  const { topics, topicsLoading, topicsError, fetchTopics } =
    useLearningStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data when user session is available
  useEffect(() => {
    if (session?.user?.id && isClient) {
      // Fetch today's entry (this will automatically create one with default Learnings note if none exists)
      fetchTodayEntry(session.user.id);

      // Fetch projects
      fetchProjects(session.user.id);

      // Fetch learning topics
      fetchTopics(session.user.id);
    }
  }, [
    session?.user?.id,
    isClient,
    fetchTodayEntry,
    fetchProjects,
    fetchTopics,
  ]);

  // Loading states
  if (status === "loading" || !isClient) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>
            Please sign in to access your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLoading = dayLoading || projectLoading || topicsLoading;
  const hasError = dayError || projectError || topicsError;

  return (
    <div className="container mx-auto p-2 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || "User"}!
          </p>
        </div>
      </div>

      {hasError && (
        <Alert variant="destructive">
          <AlertDescription>
            {dayError || projectError || topicsError}
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
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
    </div>
  );
}
