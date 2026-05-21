import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";

export function verifyController(req: Request, res: Response) {
  res.status(200).json(new ApiResponse(true, "Token valid", req.user));
}
