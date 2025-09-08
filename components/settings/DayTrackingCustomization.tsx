"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const daySections = [
  { id: "notes", label: "Note" },
  { id: "reflections", label: "Reflections" },
  { id: "tasks", label: "Tasks" },
  { id: "goals", label: "Goals" },
  { id: "metrics", label: "Metrics" },
  { id: "habits", label: "Habits" },
];

export default function DayTrackingCustomization() {
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedSections = localStorage.getItem("dayCustomization");
    if (savedSections) {
      setSelectedSections(JSON.parse(savedSections));
    } else {
      // Default to all sections being visible
      setSelectedSections(daySections.map((section) => section.id));
    }
  }, []);

  const toggleSection = (sectionId: string) => {
    const updatedSections = selectedSections.includes(sectionId)
      ? selectedSections.filter((id) => id !== sectionId)
      : [...selectedSections, sectionId];

    setSelectedSections(updatedSections);
    localStorage.setItem("dayCustomization", JSON.stringify(updatedSections));
  };

  if (!isClient) {
    // Render a skeleton or null on the server to avoid hydration mismatch
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customize Day View</CardTitle>
          <CardDescription>
            Select the components you want to see in your daily view. Changes
            are saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {daySections.map((section) => (
              <div
                key={section.id}
                className="h-10 w-full bg-muted rounded-md animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Day View</CardTitle>
        <CardDescription>
          Select the components you want to see in your daily view. Changes are
          saved automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {daySections.map((section) => (
            <Button
              key={section.id}
              variant={
                selectedSections.includes(section.id) ? "default" : "outline"
              }
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-center gap-2 transition-all duration-200"
            >
              {selectedSections.includes(section.id) && (
                <Check className="h-4 w-4" />
              )}
              {section.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
