import { Router } from "express";
import { authenticate } from "../../middlewares/authGuard";
import { AuthControllers } from "./auth.controllers";

const router = Router();

router.post("/login", AuthControllers.loginUser);
router.get("/me", authenticate, AuthControllers.getCurrentUser);

export const authRoutes = router;
