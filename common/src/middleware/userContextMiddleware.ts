import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors";

export function userContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.headers["x-user-id"];
  const email = req.headers["x-user-email"];

  if (typeof userId !== "string" || userId.length === 0) {
    return next(new UnauthorizedError("Missing user context"));
  }

  req.user = {
    userId,
    email: typeof email === "string" ? email : "",
  };

  next();
}
