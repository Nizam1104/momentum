"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, CalendarDays } from "lucide-react";
import DayNotes from "./DayNotes";
import DayTasks from "./DayTasks";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDayStore } from "@/stores/day";

interface DayComponentProps {
  day: any | null;
  isToday?: boolean;
}

export default function DayComponent({
  day,
  isToday = false,
}: DayComponentProps) {
  const [isClient, setIsClient] = useState(false);
  const { selectedDay } = useDayStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use the selected day from store or fallback to prop
  const currentDay = selectedDay || day;
  const displayDate = currentDay ? new Date(currentDay.date) : new Date();
  const dateString = displayDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const accordionValue = isToday ? "today" : currentDay?.id || dateString;

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
              {currentDay?.isCompleted && !isToday && (
                <p className="text-xs text-muted-foreground">Completed</p>
              )}
            </div>
          </div>
          {currentDay?.isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notes Section - Takes up 2/3 of the width */}
            <div className="lg:col-span-2">
              <DayNotes />
            </div>

            {/* Tasks Section - Takes up 1/3 of the width */}
            <div className="lg:col-span-1">
              <DayTasks />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
