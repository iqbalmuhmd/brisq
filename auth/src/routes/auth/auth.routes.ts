import { Router } from "express";
import { RequestHandler } from "express";

export function buildAuthRouter(deps: { registerController: RequestHandler }) {

  const router = Router();

  router.post("/register", deps.registerController);
  
  return router;
}
