// src/components/days/DaysChain.tsx
"use client"
import DayComponent from "@/components/days/Day"
import { Day } from "@/types/states"

export default function DaysChain({ days }: { days: Day[] }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayEntry = days.find(d => new Date(d.date).toISOString().split('T')[0] === todayStr) || null;

  const pastDays = days.filter(day => {
     const dayStr = new Date(day.date).toISOString().split('T')[0];
     return dayStr !== todayStr;
  });

  return (
    <div className="w-full h-auto flex flex-col space-y-4">
      {/* --- CURRENT DAY --- */}
      <section>
        <DayComponent day={todayEntry} isToday={true} />
      </section>

      {/* --- PAST DAYS --- */}
      {pastDays.length > 0 && (
        <section className="space-y-4">
           <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">History</h2>
           {pastDays
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Show most recent first
              .map((dayItem) => (
                <DayComponent key={dayItem.id} day={dayItem} />
              ))}
        </section>
      )}
    </div>
  )
}
