import { Router } from "express";
import { forwardToAuth } from "../controllers/auth.controller";

const router = Router();

router.post("/register", forwardToAuth);
router.post("/login", forwardToAuth);
router.get("/linkedin", forwardToAuth);
router.get("/linkedin/callback", forwardToAuth);
router.get("/linkedin/status/:platform", forwardToAuth);

export default router;
