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

// Authenticate (who are you)
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Authentication token missing! Please Login..");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret as jwt.Secret);

    req.user = decoded as JwtPayload;
    console.log(decoded);
    next();
  } catch (error) {
    throw new AuthError("Invalid or expired token");
  }
}

// Authorize (what can you do)
export function authorize(...roles: Role[]) {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new AppError("Forbidden Access!", 403);
    }

    next();
  };
}
