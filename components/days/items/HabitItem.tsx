// src/components/days/items/HabitItem.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Habit, HabitType } from "@/types/states";
import { cn } from "@/lib/utils";
import { Repeat } from "lucide-react";

// Mock Habit for demonstration
const mockHabit: Habit = {
    id: 'habit-1',
    name: 'Read for 15 minutes',
    category: HabitType.GENERAL,
    color: '#3b82f6',
    targetFrequency: 1,
    isActive: true,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
}

export default function HabitItem({ habit = mockHabit, completed = false }: { habit?: Habit, completed?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-2 -ml-2 rounded-md hover:bg-accent/50 transition-colors">
      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
         <Repeat className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </div>
      <label
        htmlFor={habit.id}
        className={cn(
          "flex-1 text-sm font-medium leading-none cursor-pointer",
          completed && "line-through text-muted-foreground"
        )}
      >
        {habit.name}
      </label>
      <Checkbox id={habit.id} checked={completed} className="rounded-full" />
    </div>
  );
}
