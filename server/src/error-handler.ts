import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      message: err.message
    });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    message: "Internal server error"
  });
}
