import { ActionType } from "@prisma/client";
import { z } from "zod";

export const getAuditLogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  actionType: z.nativeEnum(ActionType).optional(),
  actorId: z.string().optional(),
  targetTaskId: z.string().optional(),
});

export type GetAuditLogsQuery = z.infer<typeof getAuditLogsQuerySchema>;
