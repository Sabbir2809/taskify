import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse, AuditLog, GetAuditLogsParams, IMeta } from "../types";

export interface AuditLogsResult {
  logs: AuditLog[];
  meta: IMeta;
}

export const auditLogServices = {
  getAuditLogs: async (
    params: GetAuditLogsParams = {},
  ): Promise<AuditLogsResult> => {
    const { data } = await axiosInstance.get<ApiResponse<AuditLog[]>>(
      "/audit-logs",
      { params },
    );
    return { logs: data.data ?? [], meta: data.meta ?? {} };
  },
};
