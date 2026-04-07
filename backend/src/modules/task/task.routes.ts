import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { taskControllers } from "./task.controllers";

const router = Router();

router.get("/", taskControllers.getTasks);
router.get("/:id", taskControllers.getTaskById);

router.post("/", authGuard("ADMIN"), taskControllers.createTask);
router.put("/:id", authGuard("ADMIN"), taskControllers.updateTask);
router.delete("/:id", authGuard("ADMIN"), taskControllers.deleteTask);

router.patch("/:id/status", taskControllers.updateTaskStatus);

export const taskRoutes = router;
