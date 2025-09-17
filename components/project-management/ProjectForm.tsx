// components/project-management/ProjectForm.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Project, ProjectStatus, Priority } from "./enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Zod schema for project validation
const projectFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters." })
    .max(100, { message: "Project name cannot exceed 100 characters." }),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters." })
    .optional()
    .nullable(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Invalid hex color format.",
    })
    .default("#60A5FA"), // Default to a blue color
  status: z
    .nativeEnum(ProjectStatus, { message: "Invalid project status." })
    .default(ProjectStatus.ACTIVE),
  priority: z
    .nativeEnum(Priority, { message: "Invalid priority." })
    .default(Priority.MEDIUM),
  startDate: z.date().optional().nullable(),
  dueDate: z.date().optional().nullable(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  initialData?: Project | null;
  onSubmit: (
    data:
      | Omit<
          Project,
          | "id"
          | "userId"
          | "progress"
          | "createdAt"
          | "updatedAt"
          | "completedAt"
        >
      | Project,
  ) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      color: initialData?.color || "#60A5FA",
      status: initialData?.status || ProjectStatus.ACTIVE,
      priority: initialData?.priority || Priority.MEDIUM,
      startDate: initialData?.startDate || undefined,
      dueDate: initialData?.dueDate || undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        color: initialData.color,
        status: initialData.status,
        priority: initialData.priority,
        startDate: initialData.startDate || undefined,
        dueDate: initialData.dueDate || undefined,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        color: "#60A5FA",
        status: ProjectStatus.ACTIVE,
        priority: Priority.MEDIUM,
        startDate: undefined,
        dueDate: undefined,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: ProjectFormValues) => {
    const projectData = {
      ...values,
      description: values.description || null, // Ensure description is null if empty string
      startDate: values.startDate || null,
      dueDate: values.dueDate || null,
    };

    if (initialData) {
      onSubmit({ ...initialData, ...projectData }); // Merge with initialData for update
    } else {
      onSubmit(projectData); // New project
    }
  };

  const colorOptions = [
    { name: "Red", value: "#EF4444" }, // red-500
    { name: "Orange", value: "#F97316" }, // orange-500
    { name: "Yellow", value: "#EAB308" }, // yellow-500
    { name: "Green", value: "#22C55E" }, // green-500
    { name: "Teal", value: "#14B8A6" }, // teal-500
    { name: "Blue", value: "#3B82F6" }, // blue-500
    { name: "Indigo", value: "#6366F1" }, // indigo-500
    { name: "Purple", value: "#A855F7" }, // purple-500
    { name: "Pink", value: "#EC4899" }, // pink-500
    { name: "Gray", value: "#6B7280" }, // gray-500
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Build New Feature" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief overview of the project..."
                  className="resize-y min-h-[80px]"
                  {...field}
                  value={field.value || ""} // Ensure controlled component
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ProjectStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace(/_/g, " ").toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Priority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Project Color</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <div className="flex items-center">
                        <span
                          className="w-4 h-4 rounded-full mr-2 "
                          style={{ backgroundColor: field.value }}
                        ></span>
                        {colorOptions.find(
                          (color) => color.value === field.value,
                        )?.name || "Select color"}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search color..." />
                    <CommandList>
                      <CommandEmpty>No color found.</CommandEmpty>
                      <CommandGroup>
                        {colorOptions.map((color) => (
                          <CommandItem
                            value={color.name}
                            key={color.value}
                            onSelect={() => {
                              form.setValue("color", color.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                color.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <span
                              className="w-4 h-4 rounded-full mr-2 "
                              style={{ backgroundColor: color.value }}
                            ></span>
                            {color.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
