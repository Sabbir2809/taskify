import { Request, Response } from "express";
import { AuthError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { taskServices } from "./task.services";
import {
  createTaskSchema,
  getTasksQuerySchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "./task.validations";

const getUser = (req: Request) => {
  if (!req.user) throw new AuthError();
  return req.user;
};

const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const query = getTasksQuerySchema.parse(req.query);
  const user = getUser(req);

  const result = await taskServices.getTasksFromDB(query, user.id, user.role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tasks retrieved successfully",
    data: result.tasks,
    meta: result.meta,
  });
});

const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.id as string;

  const result = await taskServices.getTaskByIdFromDB(taskId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const createTask = asyncHandler(async (req: Request, res: Response) => {
  const dto = createTaskSchema.parse(req.body);
  const user = getUser(req);

  const result = await taskServices.createTaskIntoDB(dto, user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const dto = updateTaskSchema.parse(req.body);
  const user = getUser(req);
  const taskId = req.params.id as string;

  const result = await taskServices.updateTaskIntoDB(taskId, dto, user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const dto = updateTaskStatusSchema.parse(req.body);
  const user = getUser(req);
  const taskId = req.params.id as string;

  const result = await taskServices.updateTaskStatusIntoDB(
    taskId,
    dto,
    user.id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task status updated successfully",
    data: result,
  });
});

const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const user = getUser(req);
  const taskId = req.params.id as string;

  await taskServices.deleteTaskFromDB(taskId, user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task deleted successfully",
  });
});

export const taskControllers = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
