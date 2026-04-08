import axiosInstance from "@/lib/axiosInstance";
import { AdminStats, ApiResponse, UserStats } from "../types";

export const dashboardServices = {
  getAdminStats: async (): Promise<AdminStats> => {
    const { data } =
      await axiosInstance.get<ApiResponse<AdminStats>>("/dashboard/admin");
    return data.data!;
  },

  getUserStats: async (): Promise<UserStats> => {
    const { data } =
      await axiosInstance.get<ApiResponse<UserStats>>("/dashboard/user");
    return data.data!;
  },
};
