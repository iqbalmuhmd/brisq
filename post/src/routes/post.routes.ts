import { Router, RequestHandler } from "express";
import { userContextMiddleware, interServiceMiddleware } from "@brisq/common";

export function buildPostRouter(deps: {
  publishController: RequestHandler;
  getPostsController: RequestHandler;
  getPostController: RequestHandler;
  retryPublishController: RequestHandler;
}) {
  const router = Router();
  router.post(
    "/publish",
    interServiceMiddleware,
    userContextMiddleware,
    deps.publishController,
  );

  router.post(
    "/:postId/platforms/:platform/retry",
    interServiceMiddleware,
    userContextMiddleware,
    deps.retryPublishController,
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
