export type Role = "ADMIN" | "USER";
export type TaskStatus = "PENDING" | "PROCESSING" | "DONE";
export type ActionType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "STATUS_CHANGED"
  | "TASK_ASSIGNED";

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt?: string;
}
