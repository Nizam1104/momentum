// src/components/days/DaysChain.tsx
"use client"
import { useEffect, useState } from "react"
import { useDayStore } from "@/stores/day"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, Circle } from "lucide-react"

export default function DaysChain() {
  const { days, initialLoading } = useDayStore();
  const [streak, setStreak] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (days && days.length > 0) {
      // Calculate streak of completed days
      const sortedDays = [...days].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      let currentStreak = 0;
      
      for (const day of sortedDays) {
        if (day.isCompleted) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      setStreak(currentStreak);
    }
  }, [days]);

  if (!isClient || initialLoading) {
    return (
      <div className="space-y-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  const recentDays = days?.slice(0, 7) || [];
  const completedDays = days?.filter(d => d.isCompleted).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{streak}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{completedDays}</div>
          <div className="text-xs text-muted-foreground">Total Days</div>
        </div>
      </div>

      <div className="space-y-2">
        {recentDays.map((day) => {
          const date = new Date(day.date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={day.id} className="flex items-center justify-between p-2 rounded-lg ">
              <div className="flex items-center gap-2">
                {day.isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={`text-sm ${isToday ? 'font-semibold' : ''}`}>
                  {isToday ? 'Today' : date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
                          </div>
          );
        })}
      </div>

      {recentDays.length === 0 && (
        <div className="text-center text-muted-foreground text-sm">
          No days tracked yet. Start your journey today!
        </div>
      )}
    </div>
  )
}
