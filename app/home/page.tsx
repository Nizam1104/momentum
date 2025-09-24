// src/app/page.tsx
"use client"
import DaysChain from "@/components/days/DaysChain";

export default function Home() {
  // const days: Day[] = useDayStore().getDays(); // Use this when your store is ready

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Daily Chain</h1>
          <p className="text-muted-foreground mt-1">
            Track your metrics, reflections, notes, and goals, one day at a time.
          </p>
        </header>
        <DaysChain />
      </div>
    </main>
  );
}
