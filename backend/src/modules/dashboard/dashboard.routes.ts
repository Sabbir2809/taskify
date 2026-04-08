import { Role } from "@prisma/client";
import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { dashboardControllers } from "./dashboard.controllers";

const router = Router();

router.get("/admin", authGuard(Role.ADMIN), dashboardControllers.getAdminStats);
router.get("/user", authGuard(Role.USER), dashboardControllers.getUserStats);

export const dashboardRoutes = router;
