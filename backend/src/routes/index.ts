import { Router } from "express";
import { auditLogs } from "../modules/auditLog/auditLog.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { taskRoutes } from "../modules/task/task.routes";
import { userRoutes } from "../modules/user/user.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/tasks",
    route: taskRoutes,
  },
  {
    path: "/audit-logs",
    route: auditLogs,
  },
  {
    path: "/dashboard",
    route: dashboardRoutes,
  },
];

moduleRoutes.map((item) => router.use(item.path, item.route));

export default router;
