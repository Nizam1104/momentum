"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Target, Clock, TrendingUp, CheckCircle, PlayCircle } from "lucide-react";

interface LearningStatsData {
  totalTopics: number;
  activeTopics: number;
  completedTopics: number;
  totalConcepts: number;
  completedConcepts: number;
  totalHoursSpent: number;
  averageProgress: number;
}

interface LearningOverviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: LearningStatsData | null;
  loading?: boolean;
}

export default function LearningOverviewDialog({
  open,
  onOpenChange,
  stats,
  loading = false
}: LearningOverviewDialogProps) {
  if (!stats && !loading) {
    return null;
  }

  const conceptCompletionRate = stats && stats.totalConcepts > 0
    ? (stats.completedConcepts / stats.totalConcepts) * 100
    : 0;

  const topicCompletionRate = stats && stats.totalTopics > 0
    ? (stats.completedTopics / stats.totalTopics) * 100
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Learning Overview
          </DialogTitle>
          <DialogDescription>
            Detailed statistics and insights about your learning journey
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-[120px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[80px] mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Total Topics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Learning Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stats.totalTopics}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <PlayCircle className="h-3 w-3 text-blue-500" />
                      <span>{stats.activeTopics} active</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{stats.completedTopics} completed</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {topicCompletionRate.toFixed(1)}% completion rate
                    </div>
                    <Progress value={topicCompletionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Concepts Progress */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Learning Concepts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    {stats.completedConcepts}/{stats.totalConcepts}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {stats.totalConcepts > 0 ? (
                      <>
                        {conceptCompletionRate.toFixed(1)}% concepts mastered
                      </>
                    ) : (
                      "No concepts yet"
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Average progress across topics
                    </div>
                    <Progress value={conceptCompletionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Time Investment */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Invested
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    {stats.totalHoursSpent.toFixed(1)}h
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Total learning time
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {stats.totalTopics > 0
                        ? `~${(stats.totalHoursSpent / stats.totalTopics).toFixed(1)}h per topic average`
                        : "No time logged yet"
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Topic Progress</span>
                      <span className="font-medium">{stats.averageProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={stats.averageProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.activeTopics}
                      </div>
                      <div className="text-xs text-muted-foreground">Active Topics</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.completedTopics}
                      </div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Efficiency */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">Concepts per Topic</div>
                        <div className="text-xs text-muted-foreground">Average breakdown</div>
                      </div>
                      <div className="text-2xl font-bold">
                        {stats.totalTopics > 0
                          ? (stats.totalConcepts / stats.totalTopics).toFixed(1)
                          : "0"
                        }
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">Hours per Concept</div>
                        <div className="text-xs text-muted-foreground">Time efficiency</div>
                      </div>
                      <div className="text-2xl font-bold">
                        {stats.totalConcepts > 0
                          ? (stats.totalHoursSpent / stats.totalConcepts).toFixed(1)
                          : "0"
                        }h
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-600">Focus Areas</h4>
                      <p className="text-muted-foreground">
                        You have {stats.activeTopics} active learning topics requiring attention.
                        {stats.totalTopics > stats.activeTopics &&
                          ` ${stats.totalTopics - stats.activeTopics} topics are on hold or completed.`
                        }
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-600">Progress</h4>
                      <p className="text-muted-foreground">
                        {conceptCompletionRate > 80
                          ? "Excellent progress! You're mastering concepts effectively."
                          : conceptCompletionRate > 50
                          ? "Good momentum. Keep building on your progress."
                          : "Getting started. Focus on completing current concepts."
                        }
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-purple-600">Time Investment</h4>
                      <p className="text-muted-foreground">
                        {stats.totalHoursSpent > 20
                          ? "Significant time invested in learning. Great dedication!"
                          : stats.totalHoursSpent > 5
                          ? "Building good learning habits. Keep it up!"
                          : "Start tracking time to optimize your learning sessions."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Learning Data</h3>
            <p className="text-muted-foreground">
              Create some learning topics to see your overview statistics.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
