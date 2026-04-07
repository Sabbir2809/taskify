import { Role } from "@prisma/client";
import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { taskControllers } from "./task.controllers";

const router = Router();

router.get("/", authGuard(Role.ADMIN, Role.USER), taskControllers.getTasks);
router.get(
  "/:id",
  authGuard(Role.ADMIN, Role.USER),
  taskControllers.getTaskById
);

router.post("/", authGuard(Role.ADMIN), taskControllers.createTask);
router.put("/:id", authGuard(Role.ADMIN), taskControllers.updateTask);
router.delete("/:id", authGuard(Role.ADMIN), taskControllers.deleteTask);

router.patch(
  "/:id/status",
  authGuard(Role.ADMIN, Role.USER),
  taskControllers.updateTaskStatus
);

export const taskRoutes = router;
