import { Router } from "express";
import { authMiddleware } from "@brisq/common";
import { forwardToAsset } from "../controllers/asset.controller";

const router = Router();

router.post("/upload", authMiddleware, forwardToAsset);

export default router;
