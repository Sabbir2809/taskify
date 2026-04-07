import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../config/env";
import { AuthError, NotFoundError } from "../../utils/AppError";
import prisma from "../../utils/prisma";
import { LoginDto } from "./auth.validations";

const loginUserFromDB = async (dto: LoginDto) => {
  const user = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    throw new AuthError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);

  if (!isPasswordValid) {
    throw new AuthError("Invalid credentials");
  }

  const userInfo = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(
    userInfo,
    env.jwtSecret as jwt.Secret,
    {
      expiresIn: env.jwtExpiresIn,
    } as jwt.SignOptions
  );

  return {
    token,
    user: userInfo,
  };
};

const getUserByIdFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new NotFoundError();
  }

  return user;
};

export const authServices = {
  loginUserFromDB,
  getUserByIdFromDB,
};
