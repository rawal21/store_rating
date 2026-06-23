import { Router } from "express";
import { authenticateJwt, authorize } from "@/common/middleware/auth.middleware";
import { getDashboard } from "./admin.controller";

const router = Router();

// ── Admin only ────────────────────────────────────────────────────────────────
router.get("/dashboard", authenticateJwt, authorize("ADMIN"), getDashboard);

export default router;
