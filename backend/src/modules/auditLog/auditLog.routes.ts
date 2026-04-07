import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { getAuditLogs } from "./auditLog.controllers";

const router = Router();

router.get("/", authGuard("ADMIN"), getAuditLogs);

export const auditLogs = router;
