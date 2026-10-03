import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

export async function forwardToAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const url = `${config.auth_service.url}${req.originalUrl}`;
    const hasBody = req.method !== "GET" && req.method !== "HEAD";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Cookie: req.headers.cookie || "",
    };

    if (req.user) {
      headers["x-internal-secret"] = config.x_internal_secret!;
      headers["X-User-Id"] = req.user.userId;
      headers["X-User-Email"] = req.user.email;
    }

    const response = await fetch(url, {
      method: req.method,
      headers,
      ...(hasBody ? { body: JSON.stringify(req.body) } : {}),
    });

    const data = await response.json();

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }
    res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
}
