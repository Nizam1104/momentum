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
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DayTrackingCustomization from "../settings/DayTrackingCustomization";

interface DayComponentProps {
  day: Day | null;
  isToday?: boolean;
}

const defaultSections = [
  "notes",
  "reflections",
  "tasks",
  "goals",
  "metrics",
  "habits",
];

export default function DayComponent({
  day,
  isToday = false,
}: DayComponentProps) {
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedSections = localStorage.getItem("dayCustomization");
    if (savedSections) {
      try {
        const parsed = JSON.parse(savedSections);
        if (Array.isArray(parsed)) {
          setVisibleSections(parsed);
        } else {
          setVisibleSections(defaultSections);
        }
      } catch (error) {
        setVisibleSections(defaultSections);
      }
    } else {
      setVisibleSections(defaultSections);
    }
  }, []);

  const displayDate = day ? new Date(day.date) : new Date();
  const dateString = displayDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const accordionValue = isToday ? "today" : day?.id || dateString;

  const dayComponents: { [key: string]: React.ReactNode } = {
    notes: <Note />,
    tasks: <DayTasks />,
    goals: <DayGoals />,
    reflections: <DayReflections day={day} />,
    metrics: <DayMetrics day={day} />,
    habits: <DayHabits />,
  };

  const column1Components = ["notes"];
  const column2Components = ["goals", "tasks"];

  const visibleColumn1 = column1Components.filter((id) =>
    visibleSections.includes(id),
  );
  const visibleColumn2 = column2Components.filter((id) =>
    visibleSections.includes(id),
  );

  if (!isClient) {
    return (
      <div className="w-full border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-5" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-3 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-5 w-5" />
        </div>
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={isToday ? accordionValue : undefined}
      className="w-full"
    >
      <AccordionItem
        value={accordionValue}
        className="border rounded-lg px-4 bg-card"
      >
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-4">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <p className="font-semibold text-base">
                {isToday ? "Today" : dateString}
              </p>
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
          {visibleSections.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No sections selected. You can customize the view in the settings.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {visibleColumn1.length > 0 && (
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {visibleColumn1.map((id) => (
                    <div key={id}>{dayComponents[id]}</div>
                  ))}
                </div>
              )}
              {visibleColumn2.length > 0 && (
                <div className="lg:col-span-1 flex flex-col gap-6">
                  {visibleColumn2.map((id) => (
                    <div key={id}>{dayComponents[id]}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
