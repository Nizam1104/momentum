"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Clock,
  Target,
  Calendar,
  BookOpen,
  PlayCircle,
  CheckCircle,
  PauseCircle,
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
  isSelected,
  onClick,
}: {
  concept: LearningConcept;
  onStatusChange: (status: LearningConceptStatus) => void;
  onDelete: () => void;
  onManageNotes: () => void;
  onManageResources: () => void;
  isSelected: boolean;
  onClick: () => void;
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
    <Card className={`cursor-pointer transition-all duration-200 ${isSelected
        ? 'shadow-[0_0_0_2px_rgba(59,130,246,0.5)] hover:shadow-[0_0_0_2px_rgba(59,130,246,0.6)]'
        : 'hover:shadow-md'
      }`} onClick={onClick}>
      <CardContent className="p-4">
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
      </CardContent>
    </Card>
  );
};

export default function LearningTopicDetail({
  topic,
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

  const [selectedConcept, setSelectedConcept] =
    useState<LearningConcept | null>(null);
  const [conceptNotes, setConceptNotes] = useState<Note[]>([]);
  const [selectedView, setSelectedView] = useState<"concepts" | "notes" | "resources">("concepts");
  const [triggerNoteCreate, setTriggerNoteCreate] = useState(false);
  const [triggerResourceCreate, setTriggerResourceCreate] = useState(false);

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
    setSelectedView("notes");

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
    setSelectedView("resources");
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

  const topicConcepts = concepts.filter((c) => c.topicId === topic.id);

  return (
    <div className="space-y-6">

      {/* Error Alert */}
      {conceptsError && (
        <Alert variant="destructive">
          <AlertDescription>{conceptsError}</AlertDescription>
        </Alert>
      )}

      {/* Concepts */}
      <div className="grid grid-cols-4 gap-x-4">
        {/* Left Panel - Concepts List */}
        <div className="flex-1 col-span-1 overflow-y-auto">
          {conceptsLoading && topicConcepts.length === 0 ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-[160px]" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-[50px]" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
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
                  isSelected={selectedConcept?.id === concept.id}
                  onClick={() => {
                    setSelectedConcept(concept);
                    setSelectedView("notes");
                    handleManageNotes(concept);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Notes/Resources */}
        {selectedConcept && (
          <div className="flex-1 col-span-3">
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedConcept.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <PriorityBadge priority={selectedConcept.priority} />
                      <span className="text-sm text-muted-foreground">
                        {selectedConcept.status.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedConcept(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as "notes" | "resources")}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="notes">
                        <StickyNote className="h-4 w-4 mr-2" />
                        Notes ({selectedConcept.notes?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="resources">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Resources ({selectedConcept.resources?.length || 0})
                      </TabsTrigger>
                    </TabsList>
                    <div className="ml-4">
                      {selectedView === "notes" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTriggerNoteCreate(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Note
                        </Button>
                      )}
                      {selectedView === "resources" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTriggerResourceCreate(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Resource
                        </Button>
                      )}
                    </div>
                  </div>

                  <TabsContent value="notes" className="space-y-4">
                    <ConceptNotesList
                      concept={selectedConcept}
                      notes={conceptNotes}
                      onNotesUpdate={handleNotesUpdate}
                      triggerCreate={triggerNoteCreate}
                      onTriggeredCreate={() => setTriggerNoteCreate(false)}
                    />
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4">
                    <ConceptResourcesList
                      resources={selectedConcept.resources || []}
                      onResourcesUpdate={handleResourcesUpdate}
                      triggerCreate={triggerResourceCreate}
                      onTriggeredCreate={() => setTriggerResourceCreate(false)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
