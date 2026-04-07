import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { AppError, AuthError } from "../utils/AppError";

interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export function authGuard(...roles: Role[]) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthError("Authentication token missing! Please login.");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        env.jwtSecret as jwt.Secret
      ) as JwtPayload;
      req.user = decoded;

      // check authorization
      if (roles.length && !roles.includes(decoded.role)) {
        throw new AppError("Forbidden Access!", 403);
      }

      next();
    } catch (error) {
      throw new AuthError("Invalid or expired token");
    }
  };
}
