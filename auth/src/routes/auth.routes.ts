import { Router, RequestHandler } from "express";
import { authMiddleware, interServiceMiddleware } from "@brisq/common";
import { verifyController } from "../controllers/auth/verify.controller";

export function buildAuthRouter(deps: {
  registerController: RequestHandler;
  loginController: RequestHandler;
  linkedInController: RequestHandler;
  linkedInCallbackController: RequestHandler;
  tokenController: RequestHandler;
  linkedinStatusController: RequestHandler;
}) {
  const router = Router();

  router.post("/register", deps.registerController);
  router.post("/login", deps.loginController);
  router.get("/verify", authMiddleware, verifyController);
  router.get("/linkedin", authMiddleware, deps.linkedInController);
  router.get(
    "/linkedin/callback",
    authMiddleware,
    deps.linkedInCallbackController,
  );
  router.get("/token/:platform", interServiceMiddleware, deps.tokenController);
  router.get(
    "/linkedin/status/:platform",
    authMiddleware,
    deps.linkedinStatusController,
  );

  return router;
}
