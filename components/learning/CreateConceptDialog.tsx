"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  X,
  LinkIcon,
  BookIcon,
  VideoIcon,
  FileTextIcon,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useLearningStore } from "@/stores/learning";
import {
  LearningConceptStatus,
  Priority,
  LearningResource,
} from "@/types/states";

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
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

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(LearningConceptStatus),
  understandingLevel: z.number().min(1).max(5),
  timeSpent: z.number().min(0).optional(),
  resources: z.array(resourceSchema).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateConceptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
  userId: string;
  onSuccess?: () => void;
}

const resourceTypeIcons = {
  article: <FileTextIcon className="h-4 w-4" />,
  video: <VideoIcon className="h-4 w-4" />,
  book: <BookIcon className="h-4 w-4" />,
  course: <BookIcon className="h-4 w-4" />,
  documentation: <FileTextIcon className="h-4 w-4" />,
  other: <LinkIcon className="h-4 w-4" />,
};

export default function CreateConceptDialog({
  open,
  onOpenChange,
  topicId,
  userId,
  onSuccess,
}: CreateConceptDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createConcept } = useLearningStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: Priority.MEDIUM,
      status: LearningConceptStatus.NOT_STARTED,
      understandingLevel: 1,
      timeSpent: undefined,
      resources: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      await createConcept({
        ...data,
        topicId,
        userId,
        resources: data.resources || [],
      });

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating concept:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const addResource = () => {
    append({
      title: "",
      url: "",
      type: "article",
      description: "",
    });
  };

  const understandingLevels = [
    {
      value: 1,
      label: "1 - Just heard about it",
      color: "bg-red-100 text-red-800",
    },
    {
      value: 2,
      label: "2 - Basic understanding",
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: 3,
      label: "3 - Good understanding",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: 4,
      label: "4 - Strong understanding",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: 5,
      label: "5 - Expert level",
      color: "bg-green-100 text-green-800",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Concept</DialogTitle>
          <DialogDescription>
            Add a new concept to learn within this topic. You can add notes and
            resources after creating the concept.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., useState Hook, Linear Regression, Past Tense"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of what this concept covers"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Priority.LOW}>Low</SelectItem>
                        <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={Priority.HIGH}>High</SelectItem>
                        <SelectItem value={Priority.URGENT}>Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={LearningConceptStatus.NOT_STARTED}>
                          Not Started
                        </SelectItem>
                        <SelectItem value={LearningConceptStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={LearningConceptStatus.REVIEW}>
                          Review
                        </SelectItem>
                        <SelectItem value={LearningConceptStatus.COMPLETED}>
                          Completed
                        </SelectItem>
                        <SelectItem value={LearningConceptStatus.MASTERED}>
                          Mastered
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Understanding Level */}
              <FormField
                control={form.control}
                name="understandingLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Understanding Level</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level">
                            <div className="flex items-center gap-2">
                              <Badge
                                className={
                                  understandingLevels.find(
                                    (l) => l.value === field.value,
                                  )?.color
                                }
                              >
                                {
                                  understandingLevels.find(
                                    (l) => l.value === field.value,
                                  )?.label
                                }
                              </Badge>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {understandingLevels.map((level) => (
                          <SelectItem
                            key={level.value}
                            value={level.value.toString()}
                          >
                            <Badge className={level.color}>{level.label}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Spent */}
              <FormField
                control={form.control}
                name="timeSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Spent (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.25"
                        placeholder="e.g., 2.5"
                        {...field}
                        // Fix: Ensure the value prop is always a string or number, never undefined.
                        // If field.value is undefined, pass an empty string to the input.
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          // Fix: Convert an empty string from the input back to undefined
                          // for the form state, as timeSpent is likely optional.
                          field.onChange(
                            inputValue === ""
                              ? undefined
                              : parseFloat(inputValue),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Learning Resources</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addResource}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      Resource {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`resources.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Resource title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`resources.${index}.type`}
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
                    name={`resources.${index}.url`}
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
                    name={`resources.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>
                    No resources added yet. Click "Add Resource" to include
                    learning materials.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Concept"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
