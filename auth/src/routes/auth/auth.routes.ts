import { Router } from "express";
import { RequestHandler } from "express";
import { authMiddleware } from "@brisq/common";
import { verifyController } from "../../controllers/auth/verify.controller";

export function buildAuthRouter(deps: {
  registerController: RequestHandler;
  loginController: RequestHandler;
  linkedInController: RequestHandler;
}) {
  const router = Router();

  router.post("/register", deps.registerController);
  router.post("/login", deps.loginController);
  router.get("/verify", authMiddleware, verifyController);
  router.get('/linkedin', deps.linkedInController)

  return router;
}
