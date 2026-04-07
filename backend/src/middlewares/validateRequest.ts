import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape, ZodTypeAny } from "zod";
import { asyncHandler } from "../utils/asyncHandler";

const validateRequest = (schema: ZodObject<ZodRawShape> | ZodTypeAny) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
        query: req.query,
        params: req.params,
      });
      next();
    }
  );
};

export default validateRequest;
