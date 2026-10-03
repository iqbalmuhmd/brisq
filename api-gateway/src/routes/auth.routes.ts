import { Router } from "express";
import { authMiddleware } from "@brisq/common";
import { forwardToAuth } from "../controllers/auth.controller";

const router = Router();

router.post("/register", forwardToAuth);
router.post("/login", forwardToAuth);
router.get("/linkedin", authMiddleware, forwardToAuth);
router.get("/linkedin/callback", authMiddleware, forwardToAuth);
router.get("/linkedin/status/:platform", authMiddleware, forwardToAuth);

export default router;
