"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Target, TrendingUp, CheckCircle, PlayCircle } from "lucide-react";

interface LearningStatsData {
  totalTopics: number;
  activeTopics: number;
  completedTopics: number;
  totalConcepts: number;
  completedConcepts: number;
  averageProgress: number;
}

interface LearningStatsProps {
  stats: LearningStatsData;
  loading?: boolean;
}

export default function LearningStats({ stats, loading = false }: LearningStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const conceptCompletionRate = stats.totalConcepts > 0
    ? (stats.completedConcepts / stats.totalConcepts) * 100
    : 0;

  const topicCompletionRate = stats.totalTopics > 0
    ? (stats.completedTopics / stats.totalTopics) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Topics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Learning Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{stats.totalTopics}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PlayCircle className="h-3 w-3 text-blue-500" />
            <span>{stats.activeTopics} active</span>
            <CheckCircle className="h-3 w-3 text-green-500 ml-2" />
            <span>{stats.completedTopics} completed</span>
          </div>
          <Progress value={topicCompletionRate} className="mt-2 h-2" />
        </CardContent>
      </Card>

      {/* Concepts Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Concepts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {stats.completedConcepts}/{stats.totalConcepts}
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            {conceptCompletionRate.toFixed(1)}% completed
          </div>
          <Progress value={conceptCompletionRate} className="h-2" />
        </CardContent>
      </Card>

      
      {/* Average Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Avg Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {stats.averageProgress.toFixed(0)}%
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            Across all topics
          </div>
          <Progress value={stats.averageProgress} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
