import { NotFoundError } from "../../utils/AppError";
import prisma from "../../utils/prisma";
import { GetUsersQuery } from "./user.validations";

const getUsersFromDB = async (query: GetUsersQuery) => {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserByIdFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { assignedTasks: true } },
    },
  });

  if (!user) {
    throw new NotFoundError();
  }

  return user;
};

export const userServices = {
  getUsersFromDB,
  getUserByIdFromDB,
};
