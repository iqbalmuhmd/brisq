import { Router, RequestHandler } from "express";
import { authMiddleware } from "@brisq/common";

export function buildPostRouter(deps: { publishController: RequestHandler }) {
  const router = Router();
  router.post("/publish", authMiddleware, deps.publishController);
  return router;
}
