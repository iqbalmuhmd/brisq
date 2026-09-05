import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { buildUpdatePlatformStatusService } from "../services/updatePlatformStatus.service";

type UpdatePlatformStatusService = ReturnType<
  typeof buildUpdatePlatformStatusService
>;

export function buildUpdatePlatformStatusController(
  updatePlatformStatusService: UpdatePlatformStatusService,
) {
  return async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { platform, status, errorMessage } = req.body;

    const result = await updatePlatformStatusService(
      postId as string,
      platform,
      status,
      errorMessage,
    );

    res
      .status(200)
      .json(new ApiResponse(true, "Platform status updated", result));
  };
}
