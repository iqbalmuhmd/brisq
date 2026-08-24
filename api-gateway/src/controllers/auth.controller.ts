import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

export async function forwardToAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const url = `${config.auth_service.url}${req.originalUrl}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": config.x_internal_secret!,
        "Cookie": req.headers.cookie || ""
      },
      body: JSON.stringify(req.body),
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
