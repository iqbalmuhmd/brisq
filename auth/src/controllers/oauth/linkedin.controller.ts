import { Request, Response } from "express";
import { buildLinkedInService } from "../../services/oauth/linkedin.service";
import { ApiResponse } from "@brisq/common";
import { Logger } from "@brisq/common";

type LinkedInService = ReturnType<typeof buildLinkedInService>;

export function buildLinkedInController(
  linkedInService: LinkedInService,
  logger: Logger,
) {
  return async (req: Request, res: Response) => {
    const { url, state } = linkedInService.buildAuthUrl();

    res.cookie("state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    });

    logger.info("LinkedIn auth URL generated");

    res.status(200).json(new ApiResponse(true, "LinkedIn authorization URL generated", { url }));
  };
}