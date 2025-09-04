// src/components/days/items/TaskItem.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Task, TaskStatus, Priority } from "@/types/states"; // Assuming your types are in @/types/states
import { GripVertical, Star } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure you have this utility from shadcn

// Mock Task for demonstration
const mockTask: Task = {
  id: "task-1",
  title: "Refactor the authentication flow",
  status: TaskStatus.IN_PROGRESS,
  priority: Priority.HIGH,
  projectId: "proj-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function TaskItem({ task = mockTask }: { task?: Task }) {
  const isCompleted = task.status === "COMPLETED";

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center gap-2 p-2 -ml-2 rounded-md hover:bg-accent/50 transition-colors group">
        <GripVertical className="h-5 w-5 text-muted-foreground/50 cursor-grab" />
        <Checkbox id={task.id} checked={isCompleted} className="rounded-[4px]" />
        <label
          htmlFor={task.id}
          className={cn(
            "flex-1 text-sm font-medium leading-none cursor-pointer",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <Star className={cn("h-4 w-4", task.priority === "HIGH" ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Priority: {task.priority}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
