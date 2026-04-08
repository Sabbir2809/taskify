import { ActionType, TaskStatus } from "@/types";

export const AUTH_TOKEN_KEY = "taskify_token";
export const AUTH_STORAGE_KEY = "taskify_user";

export const ACTION_COLORS: Record<ActionType, string> = {
  TASK_CREATED: "green",
  TASK_UPDATED: "blue",
  TASK_DELETED: "red",
  STATUS_CHANGED: "orange",
  TASK_ASSIGNED: "purple",
};

export const ACTION_LABELS: Record<ActionType, string> = {
  TASK_CREATED: "Created",
  TASK_UPDATED: "Updated",
  TASK_DELETED: "Deleted",
  STATUS_CHANGED: "Status Changed",
  TASK_ASSIGNED: "Assigned",
};

export const STATUS_OPTIONS = [
  { label: "🕐 Pending", value: "PENDING" },
  { label: "🔄 Processing", value: "PROCESSING" },
  { label: "✅ Done", value: "DONE" },
];

export const ACCENT_MAP: Record<TaskStatus, string> = {
  PENDING: "#e2e5ef",
  PROCESSING: "#fef3c7",
  DONE: "#d1fae5",
};
