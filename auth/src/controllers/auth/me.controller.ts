import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { buildMeService } from "../../services/auth/me.service";

type MeService = ReturnType<typeof buildMeService>;

export function buildMeController(meService: MeService) {
  return async (req: Request, res: Response) => {
    const user = await meService(req.user!.userId);
    res.status(200).json(new ApiResponse(true, "User retrieved", user));
  };
}
