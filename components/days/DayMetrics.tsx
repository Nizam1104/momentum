// src/components/days/DayMetrics.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Day } from "@/types/states";
import { BrainCircuit, HeartPulse, TrendingUp, BedDouble } from "lucide-react";
import { useState } from "react";

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onValueChange: (value: number[]) => void;
  max?: number;
  step?: number;
}

function Metric({ icon, label, value, onValueChange, max = 10, step = 1 }: MetricProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={label} className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {label}
        </Label>
        <span className="text-sm font-semibold w-8 text-right">{value}</span>
      </div>
      <Slider
        id={label}
        defaultValue={[value]}
        onValueChange={onValueChange}
        max={max}
        step={step}
      />
    </div>
  );
}

export default function DayMetrics({ day }: { day: Day | null }) {
  // Use local state to manage slider values for an interactive UI
  // Initialize with day data or defaults
  const [energy, setEnergy] = useState(day?.energyLevel ?? 5);
  const [mood, setMood] = useState(day?.moodRating ?? 5);
  const [productivity, setProductivity] = useState(day?.productivityRating ?? 5);
  const [sleep, setSleep] = useState(day?.sleepHours ?? 7.5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Metric
          icon={<HeartPulse className="h-4 w-4 text-red-500" />}
          label="Energy Level"
          value={energy}
          onValueChange={(val) => setEnergy(val[0])}
        />
        <Metric
          icon={<BrainCircuit className="h-4 w-4 text-blue-500" />}
          label="Mood Rating"
          value={mood}
          onValueChange={(val) => setMood(val[0])}
        />
        <Metric
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          label="Productivity"
          value={productivity}
          onValueChange={(val) => setProductivity(val[0])}
        />
        <Metric
          icon={<BedDouble className="h-4 w-4 text-purple-500" />}
          label="Sleep Hours"
          value={sleep}
          onValueChange={(val) => setSleep(val[0])}
          max={12}
          step={0.5}
        />
      </CardContent>
    </Card>
  );
}
