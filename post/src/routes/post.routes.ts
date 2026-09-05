import { Router, RequestHandler } from "express";
import { authMiddleware, interServiceMiddleware } from "@brisq/common";

export function buildPostRouter(deps: {
  publishController: RequestHandler;
  updatePlatformStatusController: RequestHandler;
}) {
  const router = Router();
  router.post("/publish", authMiddleware, deps.publishController);
  router.patch(
    "/:postId/platform-status",
    interServiceMiddleware,
    deps.updatePlatformStatusController,
  );
  return router;
}
