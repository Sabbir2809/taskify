import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { dashboardServices } from "./dashboard.services";

const getAdminStats = asyncHandler(async (req: Request, res: Response) => {
  const data = await dashboardServices.getAdminStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin dashboard stats retrieved",
    data,
  });
});

const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const data = await dashboardServices.getUserStats(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User dashboard stats retrieved",
    data,
  });
});

export const dashboardControllers = {
  getUserStats,
  getAdminStats,
};
