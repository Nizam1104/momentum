"use client";
import React, { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Plus, BookOpen, TrendingUp, Target, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PriorityBadge } from "../shared/PriorityBadge";
import { Badge } from "../ui/badge";

import { useLearningStore } from "@/stores/learning";
import { getLearningStats } from "@/actions/clientActions/learning";
import { LearningTopic, LearningTopicStatus } from "@/types/states";

import LearningTopicsList from "./LearningTopicsList";
import CreateTopicDialog from "./CreateTopicDialog";
import CreateConceptDialog from "./CreateConceptDialog";
import LearningTopicDetail from "./LearningTopicDetail";
import LearningOverviewDialog from "./LearningOverviewDialog";

interface LearningStatsData {
  totalTopics: number;
  activeTopics: number;
  completedTopics: number;
  totalConcepts: number;
  completedConcepts: number;
  totalHoursSpent: number;
  averageProgress: number;
}

export default function LearningManagement() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<LearningStatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [overviewDialogOpen, setOverviewDialogOpen] = useState(false);

  const {
    topics,
    selectedTopic,
    topicsLoading,
    topicsError,
    conceptsError,
    isCreatingTopic,
    isCreatingConcept,
    setIsCreatingTopic,
    setIsCreatingConcept,
    setSelectedTopic,
  } = useLearningStore();

  const loadStats = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setStatsLoading(true);
      const learningStats = await getLearningStats(session.user.id);
      setStats(learningStats);
    } catch (error) {
      console.error("Error loading learning stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, [session?.user?.id]);

  const handleCreateTopic = () => {
    setIsCreatingTopic(true);
  };

  const handleCreateConcept = () => {
    if (selectedTopic) {
      setIsCreatingConcept(true);
    }
  };

  const handleTopicSelect = (topic: LearningTopic) => {
    setSelectedTopic(topic);
    setActiveTab("detail");
  };

  const handleBackToOverview = () => {
    setSelectedTopic(null);
    setActiveTab("overview");
  };

  const handleShowOverview = () => {
    loadStats();
    setOverviewDialogOpen(true);
  };

  if (topicsLoading && topics.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-[180px]" />
                <Skeleton className="h-4 w-[120px]" />
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

  const hasError = topicsError || conceptsError;

  const isOverdue = selectedTopic
    ? selectedTopic.targetDate &&
      new Date(selectedTopic.targetDate) < new Date() &&
      selectedTopic.status !== LearningTopicStatus.COMPLETED
    : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {selectedTopic && (
            <div className="flex items-center justify-between space-x-8">
              <div className="flex items-center gap-4">
                <Separator className="h-6" />
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedTopic.color }}
                    />
                    <span className=" -mt-1.5">{selectedTopic.title}</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <PriorityBadge priority={selectedTopic.priority} />
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        isOverdue ? "-red-200 text-red-700" : ""
                      }`}
                    >
                      {selectedTopic.status.toLowerCase().replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button size={"sm"} onClick={handleCreateConcept}>
                <Plus className="h-4 w-4 mr-2" />
                Add Concept
              </Button>
            </div>
          )}
        </div>
        <div>
          <div className="flex gap-2">
            {selectedTopic && (
              <Button variant="ghost" size="sm" onClick={handleBackToOverview}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Topics
              </Button>
            )}
            <Button onClick={handleShowOverview} size="sm" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button onClick={handleCreateTopic} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Topic
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {hasError && (
        <Alert variant="destructive">
          <AlertDescription>{topicsError || conceptsError}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="space-y-6">
          {topics.length === 0 && !topicsLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Learning Topics Yet
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  Create your first learning topic to start tracking your
                  knowledge journey.
                </p>
                <Button onClick={handleCreateTopic}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Topic
                </Button>
              </CardContent>
            </Card>
          ) : (
            <LearningTopicsList
              topics={topics}
              onTopicSelect={handleTopicSelect}
              loading={topicsLoading}
            />
          )}
        </TabsContent>

        <TabsContent value="detail" className="space-y-6">
          {selectedTopic ? (
            <LearningTopicDetail
              topic={selectedTopic}
              onBack={handleBackToOverview}
              onCreateConcept={handleCreateConcept}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Topic Selected
                </h3>
                <p className="text-muted-foreground text-center">
                  Select a topic from the overview to view its details and
                  concepts.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateTopicDialog
        open={isCreatingTopic}
        onOpenChange={setIsCreatingTopic}
        userId={session?.user?.id || ""}
        onSuccess={loadStats}
      />

      {selectedTopic && (
        <CreateConceptDialog
          open={isCreatingConcept}
          onOpenChange={setIsCreatingConcept}
          topicId={selectedTopic.id}
          userId={session?.user?.id || ""}
          onSuccess={loadStats}
        />
      )}

      <LearningOverviewDialog
        open={overviewDialogOpen}
        onOpenChange={setOverviewDialogOpen}
        stats={stats}
        loading={statsLoading}
      />
    </div>
  );
}
