import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type RequestField = "body" | "query" | "params";

export const validate = (schema: ZodSchema, field: RequestField = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req[field] = schema.parse(req[field]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        res.status(400).json({ message: "Validation error", errors });
        return;
      }
      next(err);
    }
  };
};
