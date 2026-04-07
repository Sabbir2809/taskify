import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { JWTPayload } from "../types";
import { AuthError, ForbiddenError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export function authGuard(...requiredRoles: Role[]) {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];

      // 🔐 Check token existence
      if (!token) {
        throw new AuthError("Unauthorized! Please login.");
      }

      let decodedToken: JWTPayload;

      // 🔍 Verify token
      try {
        decodedToken = jwt.verify(
          token,
          env.jwtSecret as jwt.Secret
        ) as JWTPayload;
      } catch (error) {
        throw new AuthError("Invalid or expired token.");
      }

      // 👤 Attach user to request
      req.user = decodedToken;

      // 🚫 Role-based authorization
      if (requiredRoles.length && !requiredRoles.includes(decodedToken.role)) {
        throw new ForbiddenError("Forbidden Access!");
      }

      next();
    }
  );
}
