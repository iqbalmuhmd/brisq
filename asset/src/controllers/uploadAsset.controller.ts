import { Request, Response } from "express";
import { ApiResponse, BadRequestError } from "@brisq/common";
import { buildUploadAssetService } from "../services/uploadAsset.service";

type UploadAssetService = ReturnType<typeof buildUploadAssetService>;

export function buildUploadAssetController(
  uploadAssetService: UploadAssetService,
) {
  return async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    const userId = req.user!.userId;

    const result = await uploadAssetService(req.file.buffer, userId);

    res.status(200).json(new ApiResponse(true, "Image uploaded", result));
  };
}
