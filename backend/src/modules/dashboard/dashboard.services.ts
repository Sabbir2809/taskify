import { Role, TaskStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

const getAdminStats = async () => {
  const [
    totalTasks,
    pendingTasks,
    processingTasks,
    doneTasks,
    totalUsers,
    totalAuditLogs,
  ] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: TaskStatus.PENDING } }),
    prisma.task.count({ where: { status: TaskStatus.PROCESSING } }),
    prisma.task.count({ where: { status: TaskStatus.DONE } }),
    prisma.user.count({ where: { role: Role.USER } }),
    prisma.auditLog.count(),
  ]);

  return {
    totalTasks,
    pendingTasks,
    processingTasks,
    doneTasks,
    totalUsers,
    totalAuditLogs,
  };
};

const getUserStats = async (userId: string) => {
  const [totalAssigned, pendingTasks, processingTasks, doneTasks] =
    await Promise.all([
      prisma.task.count({ where: { assignedUserId: userId } }),
      prisma.task.count({
        where: { assignedUserId: userId, status: TaskStatus.PENDING },
      }),
      prisma.task.count({
        where: { assignedUserId: userId, status: TaskStatus.PROCESSING },
      }),
      prisma.task.count({
        where: { assignedUserId: userId, status: TaskStatus.DONE },
      }),
    ]);

  const completionRate =
    totalAssigned > 0 ? Math.round((doneTasks / totalAssigned) * 100) : 0;

  return {
    totalAssigned,
    pendingTasks,
    processingTasks,
    doneTasks,
    completionRate,
  };
};

export const dashboardServices = {
  getAdminStats,
  getUserStats,
};
