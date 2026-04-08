export type Role = "ADMIN" | "USER";
export type TaskStatus = "PENDING" | "PROCESSING" | "DONE";
export type ActionType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "STATUS_CHANGED"
  | "TASK_ASSIGNED";

// ── API response shape ─────────────────────────────────────────
export interface IMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: IMeta;
  data?: T;
}

// ── Domain models ──────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignedUserId: string | null;
  assignedUser: Pick<User, "id" | "name" | "email"> | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actor: Pick<User, "id" | "name" | "email" | "role">;
  actionType: ActionType;
  targetTaskId: string | null;
  targetTask: Pick<Task, "id" | "title"> | null;
  previousData: unknown;
  newData: unknown;
  createdAt: string;
}

// ── Auth ───────────────────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthData {
  token: string;
  user: User;
}

// ── Dashboard stats ────────────────────────────────────────────
export interface AdminStats {
  totalTasks: number;
  pendingTasks: number;
  processingTasks: number;
  doneTasks: number;
  totalUsers: number;
  totalAuditLogs: number;
}

export interface UserStats {
  totalAssigned: number;
  pendingTasks: number;
  processingTasks: number;
  doneTasks: number;
  completionRate: number;
}

// ── Query params ───────────────────────────────────────────────
export interface GetTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  assignedUserId?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  actionType?: ActionType;
  actorId?: string;
  targetTaskId?: string;
}

// ── Payloads ───────────────────────────────────────────────────
export interface CreateTaskPayload {
  title: string;
  description?: string;
  assignedUserId?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  assignedUserId?: string | null;
}
