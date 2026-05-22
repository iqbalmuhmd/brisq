import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token;

  if (!token) throw new UnauthorizedError("No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { userId: string; email: string };
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }

  next();
}
