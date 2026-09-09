import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

export async function forwardToPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const url = `${config.post_service.url}${req.originalUrl}`;
    const hasBody = req.method !== "GET" && req.method !== "HEAD";

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": config.x_internal_secret!,
        "X-User-Id": req.user!.userId,
        "X-User-Email": req.user!.email,
      },
      ...(hasBody ? { body: JSON.stringify(req.body) } : {}),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
}
