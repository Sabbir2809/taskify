import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.services";
import { getUsersQuerySchema } from "./user.validations";

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const query = getUsersQuerySchema.parse(req.query);

  const result = await userServices.getUsersFromDB(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result.users,
    meta: result.meta,
  });
});

const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await userServices.getUserByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

export const userControllers = {
  getUsers,
  getUserById,
};
