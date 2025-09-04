// src/components/days/DayReflections.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Day } from "@/types/states";
import { Sparkles, ShieldAlert } from "lucide-react";

interface ReflectionProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  defaultValue?: string | null;
}

function Reflection({ icon, label, placeholder, defaultValue }: ReflectionProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </Label>
      <Textarea
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="min-h-[80px] resize-y"
      />
    </div>
  );
}

export default function DayReflections({ day }: { day: Day | null }) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Reflections</CardTitle>
        <CardDescription>What went well? What were the hurdles?</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Reflection
          icon={<Sparkles className="h-4 w-4 text-yellow-500" />}
          label="Highlights"
          placeholder="What were the wins of the day?"
          defaultValue={day?.highlights}
        />
        <Reflection
          icon={<ShieldAlert className="h-4 w-4 text-orange-500" />}
          label="Challenges"
          placeholder="What obstacles did you face?"
          defaultValue={day?.challenges}
        />
      </CardContent>
    </Card>
  );
}
