import { Priority } from "@/types/states";
import { Badge } from "@/components/ui/badge";

export const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const variants = {
    [Priority.LOW]: { variant: "secondary" as const, color: "text-gray-600" },
    [Priority.MEDIUM]: { variant: "outline" as const, color: "text-blue-600" },
    [Priority.HIGH]: { variant: "default" as const, color: "text-orange-600" },
    [Priority.URGENT]: {
      variant: "destructive" as const,
      color: "text-red-600",
    },
  };

  return (
    <Badge variant={variants[priority].variant} className="text-xs">
      {priority.toLowerCase()}
    </Badge>
  );
};
