import { Role } from "@prisma/client";
import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { authControllers } from "./auth.controllers";

const router = Router();

router.post("/login", authControllers.loginUser);
router.get(
  "/me",
  authGuard(Role.ADMIN, Role.USER),
  authControllers.getCurrentUser
);

export const authRoutes = router;
