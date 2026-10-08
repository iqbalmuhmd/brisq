import { Router, RequestHandler } from "express";
import { userContextMiddleware, interServiceMiddleware } from "@brisq/common";
import { uploadImage } from "../middleware/uploadImage.middleware";

export function buildAssetRouter(deps: {
  uploadAssetController: RequestHandler;
}) {
  const router = Router();

  router.post(
    "/upload",
    interServiceMiddleware,
    userContextMiddleware,
    uploadImage,
    deps.uploadAssetController,
  );

  return router;
}
