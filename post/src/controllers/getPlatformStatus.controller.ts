import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { buildGetPlatformStatusService } from "../services/getPlatformStatus.service";

type GetPlatformStatusService = ReturnType<typeof buildGetPlatformStatusService>;

export function buildGetPlatformStatusController(
  getPlatformStatusService: GetPlatformStatusService,
) {
  return async (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const platform = req.params.platform as string;

    const result = await getPlatformStatusService(postId, platform);

    res
      .status(200)
      .json(new ApiResponse(true, "Platform status fetched", result));
  };
}
