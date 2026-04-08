import axiosInstance from "@/lib/axiosInstance";
import {
  ApiResponse,
  CreateTaskPayload,
  GetTasksParams,
  IMeta,
  Task,
  TaskStatus,
  UpdateTaskPayload,
} from "../types";

export interface TasksResult {
  tasks: Task[];
  meta: IMeta;
}

export const taskServices = {
  getTasks: async (params: GetTasksParams = {}): Promise<TasksResult> => {
    const { data } = await axiosInstance.get<ApiResponse<Task[]>>("/tasks", {
      params,
    });
    return { tasks: data.data ?? [], meta: data.meta ?? {} };
  },

  getTaskById: async (id: string): Promise<Task> => {
    const { data } = await axiosInstance.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data.data!;
  },

  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await axiosInstance.post<ApiResponse<Task>>(
      "/tasks",
      payload,
    );
    return data.data!;
  },

  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await axiosInstance.put<ApiResponse<Task>>(
      `/tasks/${id}`,
      payload,
    );
    return data.data!;
  },

  updateTaskStatus: async (id: string, status: TaskStatus): Promise<Task> => {
    const { data } = await axiosInstance.patch<ApiResponse<Task>>(
      `/tasks/${id}/status`,
      { status },
    );
    return data.data!;
  },

  deleteTask: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tasks/${id}`);
  },
};
