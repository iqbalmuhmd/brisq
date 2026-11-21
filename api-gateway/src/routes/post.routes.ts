import { Router } from "express";
import { authMiddleware } from "@brisq/common";
import { forwardToPost } from "../controllers/post.controller";

const router = Router();

router.post("/publish", authMiddleware, forwardToPost);
router.get("/", authMiddleware, forwardToPost);
router.get("/:postId", authMiddleware, forwardToPost);
router.post("/:postId/platforms/:platform/retry", authMiddleware, forwardToPost);

export default router;
