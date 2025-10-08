// app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Import components

// Import stores
import { useDayStore } from "@/stores/day";
import { useProjectStore } from "@/stores/project";
import { useLearningStore } from "@/stores/learning";
import { useRoadStore } from "@/stores/road";

import { Suspense } from "react";
import DashboardTabs from "@/components/DashboardSearchParams";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  // Store selectors
  const {
    error: dayError,
    fetchTodayEntry,
  } = useDayStore();

  const {
    error: projectError,
    fetchProjects,
  } = useProjectStore();

  const { topicsError, fetchTopics } =
    useLearningStore();

  const { error: roadError, fetchRoads } = useRoadStore();

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

      // Fetch roads
      fetchRoads(session.user.id);
    }
  }, [
    session?.user?.id,
    isClient,
    fetchTodayEntry,
    fetchProjects,
    fetchTopics,
    fetchRoads,
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

  const hasError = dayError || projectError || topicsError || roadError;

  return (
    <div className="container mx-auto px-2 space-y-3">

      {hasError && (
        <Alert variant="destructive">
          <AlertDescription>
            {dayError || projectError || topicsError || roadError}
          </AlertDescription>
        </Alert>
      )}

      <Suspense fallback={<div>Loading tabs...</div>}>
        <DashboardTabs />
      </Suspense>
    </div>
  );
}
