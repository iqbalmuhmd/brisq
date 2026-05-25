import { Router } from "express";
import { forwardToAuth } from "../controllers/auth.controller";

const router = Router();

router.post("/register", forwardToAuth);
router.post("/login", forwardToAuth);

export default router;