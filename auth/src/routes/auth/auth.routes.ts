import { Router } from "express";
import { RequestHandler } from "express";

export function buildAuthRouter(deps: {
  registerController: RequestHandler;
  loginController: RequestHandler;
}) {
  const router = Router();

  router.post("/register", deps.registerController);
  router.post("/login", deps.loginController);

  return router;
}
