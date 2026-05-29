import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors";

export function interServiceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const secret = req.headers["x-internal-secret"];

  if (!secret || secret !== process.env.INTER_SERVICE_SECRET) {
    return next(new UnauthorizedError("Unauthorized"));
  }

  next();
}
