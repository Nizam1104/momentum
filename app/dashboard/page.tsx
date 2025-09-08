// app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Import components
import DayComponent from "@/components/days/Day";
import ProjectManagement from "@/components/project-management/ProjectManagement";
import DataFlowTest from "@/components/test/DataFlowTest";

// Import stores
import { useDayStore } from "@/stores/day";
import { useProjectStore } from "@/stores/project";

// Import types
import { Day } from "@/actions/clientActions";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  // Store selectors
  const {
    selectedDay,
    loading: dayLoading,
    error: dayError,
    fetchTodayEntry,
    fetchAllDays,
  } = useDayStore();

  const {
    projects,
    loading: projectLoading,
    error: projectError,
    fetchProjects,
  } = useProjectStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data when user session is available
  useEffect(() => {
    if (session?.user?.id && isClient) {
      // Fetch today's entry
      fetchTodayEntry(session.user.id);

      // Fetch recent days
      fetchAllDays(session.user.id, 7);

      // Fetch projects
      fetchProjects(session.user.id);
    }
  }, [
    session?.user?.id,
    isClient,
    fetchTodayEntry,
    fetchAllDays,
    fetchProjects,
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

  const isLoading = dayLoading || projectLoading;
  const hasError = dayError || projectError;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || "User"}! Here's your overview.
          </p>
        </div>
      </div>

      {hasError && (
        <Alert variant="destructive">
          <AlertDescription>{dayError || projectError}</AlertDescription>
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
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-4">
              <DayComponent day={selectedDay} isToday={true} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="h-[calc(100vh-200px)]">
            <ProjectManagement />
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <DataFlowTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
