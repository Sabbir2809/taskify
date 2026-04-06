import { Router } from "express";
const router = Router();

const moduleRoutes = [
  // {
  //   path: "/auth",
  //   route: authRoutes,
  // },
];

moduleRoutes.forEach((router) => router.use(router.path, router.route));

export default router;
