import prisma from "../../utils/prisma";
import { GetAuditLogsQuery } from "./auditLog.validations";

const getAuditLogsFromDB = async (query: GetAuditLogsQuery) => {
  const { page, limit, actionType, actorId, targetTaskId } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (actionType) where.actionType = actionType;
  if (actorId) where.actorId = actorId;
  if (targetTaskId) where.targetTaskId = targetTaskId;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
        targetTask: { select: { id: true, title: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const auditLogServices = {
  getAuditLogsFromDB,
};
