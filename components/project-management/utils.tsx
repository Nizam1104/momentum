// components/project-management/utils.ts

import { ProjectStatus, Priority, TaskStatus, Task } from "./enums";

// Helper function to format dates
export function formatDate(dateString: Date | null | undefined): string {
  if (!dateString) return "N/A";
  const dateObj = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

// Helper function to get project status styling
export function getProjectStatusConfig(status: ProjectStatus) {
  let colorClass = "";

  switch (status) {
    case ProjectStatus.ACTIVE:
      colorClass =
        "bg-green-500/20 text-green-700 dark:bg-green-400/20 dark:text-green-300 border-green-500/30";
      break;
    case ProjectStatus.COMPLETED:
      colorClass =
        "bg-blue-500/20 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300 border-blue-500/30";
      break;
    case ProjectStatus.ON_HOLD:
      colorClass =
        "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-400/20 dark:text-yellow-300 border-yellow-500/30";
      break;
    case ProjectStatus.CANCELLED:
      colorClass =
        "bg-red-500/20 text-red-700 dark:bg-red-400/20 dark:text-red-300 border-red-500/30";
      break;
    case ProjectStatus.ARCHIVED:
      colorClass =
        "bg-gray-500/20 text-gray-700 dark:bg-gray-400/20 dark:text-gray-300 border-gray-500/30";
      break;
    default:
      colorClass =
        "bg-gray-500/20 text-gray-700 dark:bg-gray-400/20 dark:text-gray-300 border-gray-500/30";
  }

  return {
    className: colorClass,
    text: status.replace(/_/g, " ").toLowerCase(),
  };
}

// Helper function to get task status styling
export function getTaskStatusConfig(status: TaskStatus) {
  let colorClass = "";

  switch (status) {
    case TaskStatus.TODO:
      colorClass =
        "bg-gray-500/20 text-gray-700 dark:bg-gray-400/20 dark:text-gray-300 border-gray-500/30";
      break;
    case TaskStatus.IN_PROGRESS:
      colorClass =
        "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-400/20 dark:text-yellow-300 border-yellow-500/30";
      break;
    case TaskStatus.COMPLETED:
      colorClass =
        "bg-green-500/20 text-green-700 dark:bg-green-400/20 dark:text-green-300 border-green-500/30";
      break;
    case TaskStatus.CANCELLED:
      colorClass =
        "bg-red-500/20 text-red-700 dark:bg-red-400/20 dark:text-red-300 border-red-500/30";
      break;
    default:
      colorClass =
        "bg-gray-500/20 text-gray-700 dark:bg-gray-400/20 dark:text-gray-300 border-gray-500/30";
  }

  return {
    className: colorClass,
    text: status.replace(/_/g, " ").toLowerCase(),
  };
}

// Helper function to get priority styling
export function getPriorityConfig(priority: Priority) {
  let colorClass = "";

  switch (priority) {
    case Priority.URGENT:
      colorClass =
        "bg-red-500/20 text-red-700 dark:bg-red-400/20 dark:text-red-300 border-red-500/30";
      break;
    case Priority.HIGH:
      colorClass =
        "bg-orange-500/20 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300 border-orange-500/30";
      break;
    case Priority.MEDIUM:
      colorClass =
        "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-400/20 dark:text-yellow-300 border-yellow-500/30";
      break;
    case Priority.LOW:
      colorClass =
        "bg-green-500/20 text-green-700 dark:bg-green-400/20 dark:text-green-300 border-green-500/30";
      break;
    default:
      colorClass =
        "bg-gray-500/20 text-gray-700 dark:bg-gray-400/20 dark:text-gray-300 border-gray-500/30";
  }

  return {
    className: colorClass,
    text: priority.toLowerCase(),
  };
}

// Function to generate a unique ID (for mock data)
export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

// Function to calculate project progress based on tasks
export function calculateProjectProgress(
  projectId: string,
  allTasks: Task[],
): number {
  const projectTasks = allTasks.filter((task) => task.projectId === projectId);
  if (projectTasks.length === 0) return 0;

  const completedTasks = projectTasks.filter(
    (task) => task.status === TaskStatus.COMPLETED,
  ).length;
  return Math.round((completedTasks / projectTasks.length) * 100);
}
