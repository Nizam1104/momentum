"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Mock data for demonstration
const mockGoals = [
  { id: "goal1", text: "Finish the UI refactor", completed: true },
  { id: "goal2", text: "Deploy the new feature branch", completed: false },
  { id: "goal3", text: "Drink 8 glasses of water", completed: false },
]

export default function Goals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockGoals.map((goal) => (
            <div key={goal.id} className="flex items-center space-x-3">
              <Checkbox id={goal.id} checked={goal.completed} />
              <Label
                htmlFor={goal.id}
                className={`text-sm font-medium ${
                  goal.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {goal.text}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
