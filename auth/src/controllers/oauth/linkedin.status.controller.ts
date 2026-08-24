import { Request, Response } from "express";
import { buildLinkedInService } from "../../services/oauth/linkedin.service";
import { ApiResponse, Logger, parsePlatform } from "@brisq/common";

type LinkedInService = ReturnType<typeof buildLinkedInService>;

export function buildLinkedInStatusController(
  linkedInService: LinkedInService,
  logger: Logger,
) {
  return async (req: Request, res: Response) => {
    const status = await linkedInService.getTokenStatus(
      req.user!.userId,
      parsePlatform(req.params.platform),
    );

    logger.info("Token status retrieved", { userId: req.user!.userId });

    res
      .status(200)
      .json(new ApiResponse(true, "Token status retrieved", status));
  };
}
