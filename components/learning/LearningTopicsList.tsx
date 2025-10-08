"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Target,
  Calendar,
  MoreVertical,
  PlayCircle,
  CheckCircle,
  PauseCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LearningTopic, LearningTopicStatus, Priority } from "@/types/states";
import { useLearningStore } from "@/stores/learning";
import {
  updateLearningTopic,
  deleteLearningTopic,
} from "@/actions/clientActions/learning";

interface LearningTopicsListProps {
  topics: LearningTopic[];
  onTopicSelect: (topic: LearningTopic) => void;
  loading?: boolean;
}

const StatusIcon = ({ status }: { status: LearningTopicStatus }) => {
  switch (status) {
    case LearningTopicStatus.ACTIVE:
      return <PlayCircle className="h-4 w-4 text-blue-500" />;
    case LearningTopicStatus.COMPLETED:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case LearningTopicStatus.ON_HOLD:
      return <PauseCircle className="h-4 w-4 text-yellow-500" />;
    case LearningTopicStatus.CANCELLED:
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <PlayCircle className="h-4 w-4 text-gray-500" />;
  }
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const variants = {
    [Priority.LOW]: "secondary",
    [Priority.MEDIUM]: "outline",
    [Priority.HIGH]: "default",
    [Priority.URGENT]: "destructive",
  } as const;

  return (
    <Badge variant={variants[priority]} className="text-xs">
      {priority.toLowerCase()}
    </Badge>
  );
};

const TopicCard = ({
  topic,
  onSelect,
  onStatusChange,
  onDelete,
}: {
  topic: LearningTopic;
  onSelect: () => void;
  onStatusChange: (status: LearningTopicStatus) => void;
  onDelete: () => void;
}) => {
  const conceptCount = topic.concepts?.length || 0;
  const completedConcepts =
    topic.concepts?.filter(
      (c) => c.status === "COMPLETED" || c.status === "MASTERED",
    ).length || 0;

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const isOverdue =
    topic.targetDate &&
    new Date(topic.targetDate) < new Date() &&
    topic.status !== LearningTopicStatus.COMPLETED;

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon status={topic.status} />
            <CardTitle className="text-lg line-clamp-1">
              {topic.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onStatusChange(LearningTopicStatus.ACTIVE)}
              >
                Mark as Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(LearningTopicStatus.ON_HOLD)}
              >
                Put on Hold
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(LearningTopicStatus.COMPLETED)}
              >
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                Delete Topic
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={topic.priority} />
          <Badge
            variant="outline"
            className={`text-xs ${isOverdue ? "-red-200 text-red-700" : ""}`}
          >
            {topic.status.toLowerCase().replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4" onClick={onSelect}>
        {/* Description */}
        {topic.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {topic.description}
          </p>
        )}

  
        {/* Stats */}
        <div className="flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {completedConcepts}/{conceptCount} concepts
          </span>
        </div>

        {/* Timeline */}
        {(topic.startDate || topic.targetDate) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 -t">
            <Calendar className="h-4 w-4" />
            <span>
              {topic.startDate ? formatDate(topic.startDate) : "Not started"}
              {" → "}
              {topic.targetDate ? (
                <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                  {formatDate(topic.targetDate)}
                </span>
              ) : (
                "No deadline"
              )}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function LearningTopicsList({
  topics,
  onTopicSelect,
  loading = false,
}: LearningTopicsListProps) {
  const { updateTopic, deleteTopic } = useLearningStore();

  const handleStatusChange = async (
    topicId: string,
    status: LearningTopicStatus,
  ) => {
    try {
      await updateLearningTopic(topicId, { status });
      updateTopic(topicId, { status });
    } catch (error) {
      console.error("Error updating topic status:", error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this topic? This will also delete all associated concepts.",
      )
    ) {
      return;
    }

    try {
      await deleteLearningTopic(topicId);
      deleteTopic(topicId);
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-[180px]" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-[60px]" />
                <Skeleton className="h-5 w-[80px]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-2 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Learning Topics</h3>
        <p className="text-muted-foreground">
          Create your first learning topic to start organizing your knowledge.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onSelect={() => onTopicSelect(topic)}
          onStatusChange={(status) => handleStatusChange(topic.id, status)}
          onDelete={() => handleDeleteTopic(topic.id)}
        />
      ))}
    </div>
  );
}
