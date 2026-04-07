import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { userControllers } from "./user.controllers";

const router = Router();

router.get("/", authGuard("ADMIN"), userControllers.getUsers);
router.get("/:id", authGuard("ADMIN"), userControllers.getUserById);

export const userRoutes = router;
