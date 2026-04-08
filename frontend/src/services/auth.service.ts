import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse, AuthData, LoginCredentials } from "../types";

export const authServices = {
  login: async (credentials: LoginCredentials): Promise<AuthData> => {
    const { data } = await axiosInstance.post<ApiResponse<AuthData>>(
      "/auth/login",
      credentials,
    );
    return data.data!;
  },

  getMe: async () => {
    const { data } = await axiosInstance.get<ApiResponse>("/auth/me");
    return data.data;
  },
};
