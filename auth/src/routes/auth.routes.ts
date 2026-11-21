import { Router, RequestHandler } from "express";
import { interServiceMiddleware, userContextMiddleware } from "@brisq/common";
import { logoutController } from "../controllers/auth/logout.controller";

export function buildAuthRouter(deps: {
  registerController: RequestHandler;
  loginController: RequestHandler;
  meController: RequestHandler;
  linkedInController: RequestHandler;
  linkedInCallbackController: RequestHandler;
  tokenController: RequestHandler;
  linkedinStatusController: RequestHandler;
  invalidateTokenController: RequestHandler;
}) {
  const router = Router();

  router.post("/register", deps.registerController);
  router.post("/login", deps.loginController);
  router.post("/logout", logoutController);
  router.get(
    "/me",
    interServiceMiddleware,
    userContextMiddleware,
    deps.meController,
  );
  router.get(
    "/linkedin",
    interServiceMiddleware,
    userContextMiddleware,
    deps.linkedInController,
  );
  router.get(
    "/linkedin/callback",
    interServiceMiddleware,
    userContextMiddleware,
    deps.linkedInCallbackController,
  );
  router.get("/token/:platform", interServiceMiddleware, deps.tokenController);
  router.get(
    "/linkedin/status/:platform",
    interServiceMiddleware,
    userContextMiddleware,
    deps.linkedinStatusController,
  );
  router.post(
    "/token/:platform/invalidate",
    interServiceMiddleware,
    userContextMiddleware,
    deps.invalidateTokenController,
  );

  return router;
}
