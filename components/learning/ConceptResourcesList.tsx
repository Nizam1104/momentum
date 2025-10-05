"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  BookOpen,
  VideoIcon,
  FileTextIcon,
  LinkIcon,
  X,
  Save,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { LearningResource } from "@/types/states";

const resourceFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  url: z.string().url("Must be a valid URL"),
  type: z.enum([
    "article",
    "video",
    "book",
    "course",
    "documentation",
    "other",
  ]),
  description: z.string().optional(),
});

type ResourceFormData = z.infer<typeof resourceFormSchema>;

interface ConceptResourcesListProps {
  resources: LearningResource[];
  onResourcesUpdate: (resources: LearningResource[]) => void;
  triggerCreate?: boolean;
  onTriggeredCreate?: () => void;
}

const resourceTypeIcons = {
  article: <FileTextIcon className="h-4 w-4" />,
  video: <VideoIcon className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
  course: <BookOpen className="h-4 w-4" />,
  documentation: <FileTextIcon className="h-4 w-4" />,
  other: <LinkIcon className="h-4 w-4" />,
};

const resourceTypeColors = {
  article: "text-blue-600",
  video: "text-red-600",
  book: "text-green-600",
  course: "text-purple-600",
  documentation: "text-gray-600",
  other: "text-orange-600",
};

const ResourceCard = ({
  resource,
  onEdit,
  onDelete,
  onSave,
  isEditing,
  onCancelEdit,
}: {
  resource: LearningResource;
  onEdit: () => void;
  onDelete: () => void;
  onSave: (data: ResourceFormData) => void;
  isEditing: boolean;
  onCancelEdit: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: resource.title,
      url: resource.url,
      type: resource.type,
      description: resource.description || "",
    },
  });

  React.useEffect(() => {
    if (isEditing) {
      form.reset({
        title: resource.title,
        url: resource.url,
        type: resource.type,
        description: resource.description || "",
      });
    }
  }, [isEditing, resource, form]);

  const handleSave = async (data: ResourceFormData) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {resource.title ? "Edit Resource" : "New Resource"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Resource title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="article">
                            <div className="flex items-center gap-2">
                              {resourceTypeIcons.article}
                              Article
                            </div>
                          </SelectItem>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              {resourceTypeIcons.video}
                              Video
                            </div>
                          </SelectItem>
                          <SelectItem value="book">
                            <div className="flex items-center gap-2">
                              {resourceTypeIcons.book}
                              Book
                            </div>
                          </SelectItem>
                          <SelectItem value="course">
                            <div className="flex items-center gap-2">
                              {resourceTypeIcons.course}
                              Course
                            </div>
                          </SelectItem>
                          <SelectItem value="documentation">
                            <div className="flex items-center gap-2">
                              {resourceTypeIcons.documentation}
                              Documentation
                            </div>
                          </SelectItem>
                          <SelectItem value="other">
                            <div className="flex items-center gap-2">
                              {resourceTypeIcons.other}
                              Other
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief description of the resource..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Resource
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancelEdit}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="group py-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {resourceTypeIcons[resource.type]}
          <h4 className="font-medium text-base">{resource.title}</h4>
          <span className={`text-sm ${resourceTypeColors[resource.type]}`}>
            {resource.type}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-7 w-7 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 w-7 p-0 text-red-600"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {resource.description && (
        <p className="text-sm text-muted-foreground mb-2">
          {resource.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {getDomainFromUrl(resource.url)}
        </span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Open
        </a>
      </div>
    </div>
  );
};

export default function ConceptResourcesList({
  resources,
  onResourcesUpdate,
  triggerCreate,
  onTriggeredCreate,
}: ConceptResourcesListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (triggerCreate && !isCreating) {
      handleCreateResource();
      onTriggeredCreate?.();
    }
  }, [triggerCreate, isCreating, onTriggeredCreate]);

  const handleCreateResource = () => {
    setIsCreating(true);
    setEditingIndex(null);
  };

  const handleEditResource = (index: number) => {
    setEditingIndex(index);
    setIsCreating(false);
  };

  const handleSaveResource = async (data: ResourceFormData, index?: number) => {
    let updatedResources: LearningResource[];

    if (typeof index === "number") {
      // Update existing resource
      updatedResources = resources.map((resource, i) =>
        i === index ? { ...data } : resource,
      );
    } else {
      // Create new resource
      updatedResources = [...resources, { ...data }];
    }

    onResourcesUpdate(updatedResources);
    setIsCreating(false);
    setEditingIndex(null);
  };

  const handleDeleteResource = (index: number) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    const updatedResources = resources.filter((_, i) => i !== index);
    onResourcesUpdate(updatedResources);
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Create New Resource Form */}
      {isCreating && (
        <div className="mb-4">
          <ResourceCard
            resource={{
              title: "",
              url: "",
              type: "article",
              description: "",
            }}
            onEdit={() => {}}
            onDelete={() => {}}
            onSave={(data) => handleSaveResource(data)}
            isEditing={true}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      )}

      {/* Resources List */}
      {resources.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            No resources yet. Add learning materials to support your
            understanding.
          </p>
          {!isCreating && (
            <Button onClick={handleCreateResource} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              resource={resource}
              onEdit={() => handleEditResource(index)}
              onDelete={() => handleDeleteResource(index)}
              onSave={(data) => handleSaveResource(data, index)}
              isEditing={editingIndex === index}
              onCancelEdit={handleCancelEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
