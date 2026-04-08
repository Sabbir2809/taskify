import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse, GetUsersParams, IMeta, User } from "../types";

export interface UsersResult {
  users: User[];
  meta: IMeta;
}

export const userServices = {
  getUsers: async (params: GetUsersParams = {}): Promise<UsersResult> => {
    const { data } = await axiosInstance.get<ApiResponse<User[]>>("/users", {
      params,
    });
    return { users: data.data ?? [], meta: data.meta ?? {} };
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return data.data!;
  },
};
