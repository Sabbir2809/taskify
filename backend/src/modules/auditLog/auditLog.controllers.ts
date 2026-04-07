import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { auditLogServices } from "./auditLog.services";
import { getAuditLogsQuerySchema } from "./auditLog.validations";

const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const query = getAuditLogsQuerySchema.parse(req.query);

  const result = await auditLogServices.getAuditLogsFromDB(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Audit logs retrieved successfully",
    meta: result.meta,
    data: result.logs,
  });
});

export const auditLogControllers = {
  getAuditLogs,
};
