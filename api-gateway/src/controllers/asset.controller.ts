import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@brisq/common";
import { config } from "../config/env";

export async function forwardToAsset(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType) {
      return next(new BadRequestError("Missing content-type"));
    }

    const url = `${config.asset_service.url}/assets/upload`;

    const init: RequestInit & { duplex: "half" } = {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "x-internal-secret": config.x_internal_secret!,
        "X-User-Id": req.user!.userId,
      },
      body: req as unknown as ReadableStream,
      duplex: "half",
    };

    const response = await fetch(url, init);

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
}
