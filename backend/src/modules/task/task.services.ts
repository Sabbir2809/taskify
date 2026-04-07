import { ActionType, Role } from "@prisma/client";
import { NotFoundError } from "../../utils/AppError";
import prisma from "../../utils/prisma";
import {
  CreateTaskDto,
  GetTasksQuery,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from "./task.validations";

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  assignedUserId: true,
  createdAt: true,
  updatedAt: true,
  assignedUser: {
    select: { id: true, name: true, email: true },
  },
};

const createAuditLogIntoDB = async (data: {
  actorId: string;
  actionType: ActionType;
  targetTaskId: string | null;
  previousData: unknown;
  newData: unknown;
}) => {
  await prisma.auditLog.create({
    data: {
      actorId: data.actorId,
      actionType: data.actionType,
      targetTaskId: data.targetTaskId,
      previousData: data.previousData
        ? (data.previousData as object)
        : undefined,
      newData: data.newData ? (data.newData as object) : undefined,
    },
  });
};

const getTasksFromDB = async (
  query: GetTasksQuery,
  actorId: string,
  actorRole: Role
) => {
  const { page, limit, search, status, assignedUserId } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (actorRole === Role.USER) {
    where["assignedUserId"] = actorId;
  } else if (assignedUserId) {
    where["assignedUserId"] = assignedUserId;
  }

  if (status) where["status"] = status;

  if (search) {
    where["OR"] = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      select: taskSelect,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getTaskByIdFromDB = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: taskSelect,
  });

  if (!task) throw new NotFoundError("Task not found");

  return task;
};

const createTaskIntoDB = async (dto: CreateTaskDto, actorId: string) => {
  if (dto.assignedUserId) {
    const user = await prisma.user.findUnique({
      where: { id: dto.assignedUserId },
    });
    if (!user) throw new NotFoundError("Assigned user not found");
  }

  const task = await prisma.task.create({
    data: dto,
    select: taskSelect,
  });

  await createAuditLogIntoDB({
    actorId,
    actionType: ActionType.TASK_CREATED,
    targetTaskId: task.id,
    previousData: null,
    newData: task,
  });

  return task;
};

const updateTaskIntoDB = async (
  taskId: string,
  dto: UpdateTaskDto,
  actorId: string
) => {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw new NotFoundError("Task not found");

  if (dto.assignedUserId !== undefined && dto.assignedUserId !== null) {
    const user = await prisma.user.findUnique({
      where: { id: dto.assignedUserId },
    });
    if (!user) throw new NotFoundError("Assigned user not found");
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: dto,
    select: taskSelect,
  });

  const actionType =
    dto.assignedUserId !== undefined &&
    dto.assignedUserId !== existing.assignedUserId
      ? ActionType.TASK_ASSIGNED
      : ActionType.TASK_UPDATED;

  await createAuditLogIntoDB({
    actorId,
    actionType,
    targetTaskId: taskId,
    previousData: existing,
    newData: updated,
  });

  return updated;
};

const updateTaskStatusIntoDB = async (
  taskId: string,
  dto: UpdateTaskStatusDto,
  actorId: string
) => {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw new NotFoundError("Task not found");

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status: dto.status },
    select: taskSelect,
  });

  await createAuditLogIntoDB({
    actorId,
    actionType: ActionType.STATUS_CHANGED,
    targetTaskId: taskId,
    previousData: { status: existing.status },
    newData: { status: dto.status },
  });

  return updated;
};

const deleteTaskFromDB = async (taskId: string, actorId: string) => {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw new NotFoundError("Task not found");

  await prisma.task.delete({ where: { id: taskId } });

  await createAuditLogIntoDB({
    actorId,
    actionType: ActionType.TASK_DELETED,
    targetTaskId: null,
    previousData: existing,
    newData: null,
  });
};

export const taskServices = {
  getTasksFromDB,
  getTaskByIdFromDB,
  createTaskIntoDB,
  updateTaskIntoDB,
  updateTaskStatusIntoDB,
  deleteTaskFromDB,
};
