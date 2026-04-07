import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
];

moduleRoutes.map((item) => router.use(item.path, item.route));

export default router;
