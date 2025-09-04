// src/app/page.tsx
"use client"
import DaysChain from "@/components/days/DaysChain";
import { useDayStore } from "@/stores/day";
import { Day } from "@/types/states";

export default function Home() {
  // const days: Day[] = useDayStore().getDays(); // Use this when your store is ready

  const mockDays: Day[] = [
    {
      id: 'day-1',
      date: new Date('2025-09-03T00:00:00.000Z'),
      userId: 'user-1',
      energyLevel: 8,
      moodRating: 9,
      productivityRating: 7,
      sleepHours: 7.5,
      highlights: "Finished the big UI refactor and it feels great. The new design is clean and functional.",
      challenges: "Struggled a bit with a complex state management issue in the afternoon.",
      isCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      sleepQuality: null,
      lessons: null,
      gratitude: null,
      tomorrowFocus: null,
    }
  ];

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Daily Chain</h1>
          <p className="text-muted-foreground mt-1">
            Track your metrics, reflections, notes, and goals, one day at a time.
          </p>
        </header>
        <DaysChain days={mockDays} />
      </div>
    </main>
  );
}
