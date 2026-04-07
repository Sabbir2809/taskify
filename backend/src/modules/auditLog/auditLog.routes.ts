import { Role } from "@prisma/client";
import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { auditLogControllers } from "./auditLog.controllers";

const router = Router();

router.get("/", authGuard(Role.ADMIN), auditLogControllers.getAuditLogs);

export const auditLogs = router;
