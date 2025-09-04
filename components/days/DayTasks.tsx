// src/components/days/DayTasks.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import TaskItem from "./items/TaskItem";
import { Separator } from "../ui/separator";

export default function DayTasks() {
  // MOCK DATA: Replace with actual data fetching for the given day
  const tasks = [
    { id: "task-1", title: "Refactor the authentication flow", status: "IN_PROGRESS", priority: "HIGH" },
    { id: "task-2", title: "Design the new dashboard layout", status: "TODO", priority: "MEDIUM" },
    { id: "task-3", title: "Fix bug #1123 in the reporting module", status: "COMPLETED", priority: "HIGH" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Today's Tasks</CardTitle>
          <CardDescription>3 tasks remaining</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <TaskItem key={task.id} task={task as any} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
