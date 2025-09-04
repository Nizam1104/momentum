// src/components/days/items/GoalItem.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Goal, GoalType, GoalStatus, Priority } from "@/types/states";
import { cn } from "@/lib/utils";
import { Target } from "lucide-react";

// Mock Goal for demonstration
const mockGoal: Goal = {
    id: 'goal-1',
    title: 'Complete project proposal draft',
    type: GoalType.PERSONAL,
    status: GoalStatus.ACTIVE,
    priority: Priority.HIGH,
    color: '#ef4444',
    isQuantifiable: false,
    currentValue: 0,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
}

export default function GoalItem({ goal = mockGoal, completed = false }: { goal?: Goal, completed?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-2 -ml-2 rounded-md hover:bg-accent/50 transition-colors">
       <div className="p-1.5 bg-red-100 dark:bg-red-900/50 rounded-md">
         <Target className="h-4 w-4 text-red-600 dark:text-red-400" />
      </div>
      <label
        htmlFor={goal.id}
        className={cn(
          "flex-1 text-sm font-medium leading-none cursor-pointer",
          completed && "line-through text-muted-foreground"
        )}
      >
        {goal.title}
      </label>
      <Checkbox id={goal.id} checked={completed} />
    </div>
  );
}
