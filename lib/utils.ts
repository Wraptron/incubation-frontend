import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/** Status badge colors matching the main dashboard applications table. */
export function getApplicationStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    under_review: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    evaluated: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    approved: "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary font-semibold",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
}