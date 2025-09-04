// src/components/days/DayGoals.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GoalItem from "./items/GoalItem";

export default function DayGoals() {
  // MOCK DATA: Replace with actual data
  const goals = [
    { id: 'goal-1', title: 'Complete project proposal draft' },
    { id: 'goal-2', title: 'Outline Q4 marketing strategy' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Daily Goals</CardTitle>
        <CardDescription>Focus on what matters most today.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <GoalItem goal={goals[0] as any} completed={false} />
          <GoalItem goal={goals[1] as any} completed={true} />
        </div>
      </CardContent>
    </Card>
  );
}
