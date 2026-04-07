import { Role } from "@prisma/client";
import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { userControllers } from "./user.controllers";

const router = Router();

router.get("/", authGuard(Role.ADMIN), userControllers.getUsers);
router.get("/:id", authGuard(Role.ADMIN), userControllers.getUserById);

export const userRoutes = router;
