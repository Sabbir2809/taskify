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
    recentTasks,
    tasksByStatus,
  ] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: TaskStatus.PENDING } }),
    prisma.task.count({ where: { status: TaskStatus.PROCESSING } }),
    prisma.task.count({ where: { status: TaskStatus.DONE } }),
    prisma.user.count({ where: { role: Role.USER } }),
    prisma.auditLog.count(),
    prisma.task.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.task.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  return {
    overview: {
      totalTasks,
      pendingTasks,
      processingTasks,
      doneTasks,
      totalUsers,
      totalAuditLogs,
    },
    tasksByStatus: tasksByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    recentTasks,
  };
};

const getUserStats = async (userId: string) => {
  const [totalAssigned, pendingTasks, processingTasks, doneTasks, recentTasks] =
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
      prisma.task.findMany({
        where: { assignedUserId: userId },
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

  const completionRate =
    totalAssigned > 0 ? Math.round((doneTasks / totalAssigned) * 100) : 0;

  return {
    overview: {
      totalAssigned,
      pendingTasks,
      processingTasks,
      doneTasks,
      completionRate,
    },
    recentTasks,
  };
};

export const dashboardServices = {
  getAdminStats,
  getUserStats,
};
