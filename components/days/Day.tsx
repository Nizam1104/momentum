// src/components/days/Day.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Day } from "@/types/states";
import { CheckCircle2, CalendarDays } from "lucide-react";
import DayMetrics from "./DayMetrics";
import DayReflections from "./DayReflections";
import DayTasks from "./DayTasks";
import DayGoals from "./DayGoals";
import DayHabits from "./DayHabits";
import Note from "../notes/Note";

interface DayComponentProps {
  day: Day | null;
  isToday?: boolean;
}

export default function DayComponent({ day, isToday = false }: DayComponentProps) {
  const displayDate = day ? new Date(day.date) : new Date();
  const dateString = displayDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const accordionValue = isToday ? "today" : (day?.id || dateString);

  return (
    <Accordion type="single" collapsible defaultValue={isToday ? accordionValue : undefined} className="w-full">
      <AccordionItem value={accordionValue} className="border rounded-lg px-4 bg-card">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-4">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <p className="font-semibold text-base">{isToday ? "Today" : dateString}</p>
              {day?.isCompleted && !isToday && (
                <p className="text-xs text-muted-foreground">Completed</p>
              )}
            </div>
          </div>
          {day?.isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <DayMetrics day={day} />
              <DayHabits />
            </div>
            {/* Column 2 */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Note />
              <DayReflections day={day} />
              <DayTasks />
              <DayGoals />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
