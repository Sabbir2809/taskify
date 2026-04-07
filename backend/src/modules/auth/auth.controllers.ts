import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.services";
import { loginSchema } from "./auth.validations";

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const dto = loginSchema.parse(req.body);

  const result = await authServices.loginUser(dto);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const result = await authServices.getUserById(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  }
);

export const AuthControllers = {
  loginUser,
  getCurrentUser,
};
