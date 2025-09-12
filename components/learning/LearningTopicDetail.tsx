"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Plus,
  Clock,
  Target,
  Calendar,
  BookOpen,
  ExternalLink,
  Edit,
  Trash2,
  PlayCircle,
  CheckCircle,
  PauseCircle,
  XCircle,
  Star,
  MoreVertical,
  StickyNote,
  Link,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLearningStore } from "@/stores/learning";
import {
  LearningTopic,
  LearningConcept,
  LearningTopicStatus,
  LearningConceptStatus,
  Priority,
  Note,
  LearningResource,
} from "@/types/states";
import {
  updateLearningConcept,
  deleteLearningConcept,
  fetchConceptNotes,
} from "@/actions/clientActions/learning";
import ConceptNotesList from "./ConceptNotesList";
import ConceptResourcesList from "./ConceptResourcesList";

interface LearningTopicDetailProps {
  topic: LearningTopic;
  onBack: () => void;
  onCreateConcept: () => void;
}

const StatusIcon = ({ status }: { status: LearningConceptStatus }) => {
  switch (status) {
    case LearningConceptStatus.NOT_STARTED:
      return <div className="h-3 w-3 rounded-full bg-gray-300" />;
    case LearningConceptStatus.IN_PROGRESS:
      return <PlayCircle className="h-4 w-4 text-blue-500" />;
    case LearningConceptStatus.REVIEW:
      return <PauseCircle className="h-4 w-4 text-yellow-500" />;
    case LearningConceptStatus.COMPLETED:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case LearningConceptStatus.MASTERED:
      return <Star className="h-4 w-4 text-yellow-500 fill-current" />;
    default:
      return <div className="h-3 w-3 rounded-full bg-gray-300" />;
  }
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const variants = {
    [Priority.LOW]: { variant: "secondary" as const, color: "text-gray-600" },
    [Priority.MEDIUM]: { variant: "outline" as const, color: "text-blue-600" },
    [Priority.HIGH]: { variant: "default" as const, color: "text-orange-600" },
    [Priority.URGENT]: {
      variant: "destructive" as const,
      color: "text-red-600",
    },
  };

  return (
    <Badge variant={variants[priority].variant} className="text-xs">
      {priority.toLowerCase()}
    </Badge>
  );
};

const UnderstandingLevel = ({ level }: { level: number }) => {
  const colors = [
    "bg-red-100 text-red-800",
    "bg-orange-100 text-orange-800",
    "bg-yellow-100 text-yellow-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
  ];

  const labels = [
    "Just heard about it",
    "Basic understanding",
    "Good understanding",
    "Strong understanding",
    "Expert level",
  ];

  return (
    <Badge className={`text-xs ${colors[level - 1]}`}>
      {level}/5 - {labels[level - 1]}
    </Badge>
  );
};

const ConceptCard = ({
  concept,
  onStatusChange,
  onDelete,
  onManageNotes,
  onManageResources,
}: {
  concept: LearningConcept;
  onStatusChange: (status: LearningConceptStatus) => void;
  onDelete: () => void;
  onManageNotes: () => void;
  onManageResources: () => void;
}) => {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not set";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="group p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon status={concept.status} />
          <h4 className="font-medium text-base">{concept.title}</h4>
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
            <DropdownMenuItem onClick={onManageNotes}>
              <StickyNote className="h-4 w-4 mr-2" />
              Manage Notes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onManageResources}>
              <Link className="h-4 w-4 mr-2" />
              Manage Resources
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(LearningConceptStatus.IN_PROGRESS)}
            >
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(LearningConceptStatus.COMPLETED)}
            >
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(LearningConceptStatus.MASTERED)}
            >
              Mark as Mastered
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(LearningConceptStatus.REVIEW)}
            >
              Mark for Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              Delete Concept
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <PriorityBadge priority={concept.priority} />
        <span className="text-xs text-muted-foreground">
          {concept.status.toLowerCase().replace("_", " ")}
        </span>
        <UnderstandingLevel level={concept.understandingLevel} />
      </div>
      {/* Description */}
      {concept.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {concept.description}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {concept.timeSpent?.toFixed(1) || 0}h spent
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {concept.completedAt
              ? formatDate(concept.completedAt)
              : "In progress"}
          </span>
        </div>
      </div>

      {/* Notes and Resources Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {concept.notes?.length || 0} notes
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {concept.resources?.length || 0} resources
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onManageNotes}>
          <StickyNote className="h-3 w-3 mr-1" />
          Notes ({concept.notes?.length || 0})
        </Button>
        <Button variant="outline" size="sm" onClick={onManageResources}>
          <Link className="h-3 w-3 mr-1" />
          Resources ({concept.resources?.length || 0})
        </Button>
      </div>
    </div>
  );
};

export default function LearningTopicDetail({
  topic,
  onBack,
  onCreateConcept,
}: LearningTopicDetailProps) {
  const {
    concepts,
    conceptsLoading,
    conceptsError,
    fetchTopicConcepts,
    updateConcept,
    deleteConcept,
    updateTopicProgress,
  } = useLearningStore();

  const [activeTab, setActiveTab] = useState("concepts");
  const [selectedConcept, setSelectedConcept] =
    useState<LearningConcept | null>(null);
  const [conceptNotes, setConceptNotes] = useState<Note[]>([]);

  // Fetch concepts for this topic
  useEffect(() => {
    if (topic.id) {
      fetchTopicConcepts(topic.id);
    }
  }, [topic.id, fetchTopicConcepts]);

  // Update topic progress when concepts change
  useEffect(() => {
    updateTopicProgress(topic.id);
  }, [concepts, topic.id, updateTopicProgress]);

  const handleConceptStatusChange = async (
    conceptId: string,
    status: LearningConceptStatus,
  ) => {
    try {
      await updateLearningConcept(conceptId, {
        status,
        completedAt:
          status === LearningConceptStatus.COMPLETED ||
          status === LearningConceptStatus.MASTERED
            ? new Date()
            : null,
      });
      updateConcept(conceptId, {
        status,
        completedAt:
          status === LearningConceptStatus.COMPLETED ||
          status === LearningConceptStatus.MASTERED
            ? new Date()
            : null,
      });
    } catch (error) {
      console.error("Error updating concept status:", error);
    }
  };

  const handleDeleteConcept = async (conceptId: string) => {
    if (!confirm("Are you sure you want to delete this concept?")) {
      return;
    }

    try {
      await deleteLearningConcept(conceptId);
      deleteConcept(conceptId);
    } catch (error) {
      console.error("Error deleting concept:", error);
    }
  };

  const handleManageNotes = async (concept: LearningConcept) => {
    setSelectedConcept(concept);
    setActiveTab("notes");

    // Fetch the latest notes for this concept
    try {
      const notes = await fetchConceptNotes(concept.id);
      setConceptNotes(notes);
    } catch (error) {
      console.error("Error fetching concept notes:", error);
      setConceptNotes(concept.notes || []);
    }
  };

  const handleManageResources = (concept: LearningConcept) => {
    setSelectedConcept(concept);
    setActiveTab("resources");
  };

  const handleNotesUpdate = async (notes: Note[]) => {
    if (!selectedConcept) return;

    try {
      // Update local state for both the concept notes and the store
      setConceptNotes(notes);
      updateConcept(selectedConcept.id, { notes });
    } catch (error) {
      console.error("Error updating concept notes:", error);
    }
  };

  const handleResourcesUpdate = async (resources: LearningResource[]) => {
    if (!selectedConcept) return;

    try {
      await updateLearningConcept(selectedConcept.id, { resources });
      updateConcept(selectedConcept.id, { resources });
    } catch (error) {
      console.error("Error updating concept resources:", error);
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not set";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const topicConcepts = concepts.filter((c) => c.topicId === topic.id);
  const completedConcepts = topicConcepts.filter(
    (c) =>
      c.status === LearningConceptStatus.COMPLETED ||
      c.status === LearningConceptStatus.MASTERED,
  );

  const isOverdue =
    topic.targetDate &&
    new Date(topic.targetDate) < new Date() &&
    topic.status !== LearningTopicStatus.COMPLETED;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: topic.color }}
              />
              {topic.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <PriorityBadge priority={topic.priority} />
              <Badge
                variant="outline"
                className={`text-xs ${isOverdue ? "border-red-200 text-red-700" : ""}`}
              >
                {topic.status.toLowerCase().replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
        <Button onClick={onCreateConcept}>
          <Plus className="h-4 w-4 mr-2" />
          Add Concept
        </Button>
      </div>

      {/* Topic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{topic.progress}%</div>
            <Progress value={topic.progress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedConcepts.length}/{topicConcepts.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {topicConcepts.length > 0
                ? `${Math.round((completedConcepts.length / topicConcepts.length) * 100)}% completed`
                : "No concepts yet"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topic.actualHours?.toFixed(1) || 0}h
            </div>
            <div className="text-sm text-muted-foreground">
              {topic.estimatedHours
                ? `of ${topic.estimatedHours}h estimated`
                : "No estimate set"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>Started: {formatDate(topic.startDate)}</div>
              <div className={isOverdue ? "text-red-600 font-medium" : ""}>
                Target: {formatDate(topic.targetDate)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {topic.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{topic.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {conceptsError && (
        <Alert variant="destructive">
          <AlertDescription>{conceptsError}</AlertDescription>
        </Alert>
      )}

      {/* Concepts */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="concepts">
            Concepts ({topicConcepts.length})
          </TabsTrigger>
          <TabsTrigger value="notes" disabled={!selectedConcept}>
            Notes {selectedConcept ? `- ${selectedConcept.title}` : ""}
          </TabsTrigger>
          <TabsTrigger value="resources" disabled={!selectedConcept}>
            Resources {selectedConcept ? `- ${selectedConcept.title}` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="concepts" className="space-y-6">
          {conceptsLoading && topicConcepts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-[160px]" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-[50px]" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : topicConcepts.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Concepts Yet</h3>
              <p className="text-muted-foreground mb-6">
                Break down this topic into smaller concepts to track your
                learning progress.
              </p>
              <Button onClick={onCreateConcept}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Concept
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {topicConcepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  onStatusChange={(status) =>
                    handleConceptStatusChange(concept.id, status)
                  }
                  onDelete={() => handleDeleteConcept(concept.id)}
                  onManageNotes={() => handleManageNotes(concept)}
                  onManageResources={() => handleManageResources(concept)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          {/* Aggregate all resources from concepts */}
          {(() => {
            const allResources = topicConcepts.flatMap((concept) =>
              (concept.resources || []).map((resource) => ({
                ...resource,
                conceptTitle: concept.title,
              })),
            );

            return allResources.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Resources Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Add concepts with learning resources to see them aggregated
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allResources.map((resource, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium line-clamp-1">
                        {resource.title}
                      </h4>
                      <span className="text-xs text-muted-foreground ml-2">
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      From: {resource.conceptTitle}
                    </p>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Resource
                    </a>
                  </div>
                ))}
              </div>
            );
          })()}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          {selectedConcept ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Notes for "{selectedConcept.title}"
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("concepts")}
                >
                  Back to Concepts
                </Button>
              </div>
              <ConceptNotesList
                concept={selectedConcept}
                notes={conceptNotes}
                onNotesUpdate={handleNotesUpdate}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Concept</h3>
              <p className="text-muted-foreground">
                Choose a concept to manage its notes.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          {selectedConcept ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Resources for "{selectedConcept.title}"
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("concepts")}
                >
                  Back to Concepts
                </Button>
              </div>
              <ConceptResourcesList
                concept={selectedConcept}
                resources={selectedConcept.resources || []}
                onResourcesUpdate={handleResourcesUpdate}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Concept</h3>
              <p className="text-muted-foreground">
                Choose a concept to manage its resources.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
