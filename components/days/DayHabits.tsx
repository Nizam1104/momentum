// src/components/days/DayHabits.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HabitItem from "./items/HabitItem";

export default function DayHabits() {
  // MOCK DATA: Replace with actual data
  const habits = [
    { id: 'habit-1', name: 'Read for 15 minutes' },
    { id: 'habit-2', name: 'Morning meditation' },
    { id: 'habit-3', name: 'Drink 8 glasses of water' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Habit Tracker</CardTitle>
        <CardDescription>Stay consistent with your routines.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <HabitItem habit={habits[0] as any} completed={true} />
          <HabitItem habit={habits[1] as any} completed={false} />
          <HabitItem habit={habits[2] as any} completed={false} />
        </div>
      </CardContent>
    </Card>
  );
}
