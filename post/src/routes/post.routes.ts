import { Router, RequestHandler } from "express";
import { userContextMiddleware, interServiceMiddleware } from "@brisq/common";

export function buildPostRouter(deps: {
  publishController: RequestHandler;
  updatePlatformStatusController: RequestHandler;
  getPostsController: RequestHandler;
  getPostController: RequestHandler;
}) {
  const router = Router();
  router.post(
    "/publish",
    interServiceMiddleware,
    userContextMiddleware,
    deps.publishController,
  );
  router.patch(
    "/:postId/platform-status",
    interServiceMiddleware,
    userContextMiddleware,
    deps.updatePlatformStatusController,
  );
  router.get(
    "/",
    interServiceMiddleware,
    userContextMiddleware,
    deps.getPostsController,
  );
  router.get(
    "/:postId",
    interServiceMiddleware,
    userContextMiddleware,
    deps.getPostController,
  );

  return router;
}
