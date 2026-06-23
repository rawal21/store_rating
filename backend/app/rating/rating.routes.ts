import { Router } from "express";
import { authenticateJwt, authorize } from "@/common/middleware/auth.middleware";
import { catchError } from "@/common/middleware/catch-error.middlware";
import {
  createRating,
  updateRating,
  deleteRating,
  getRatingById,
  getRatingsByStore,
  getMyRatings,
} from "./rating.controller";
import {
  createRatingValidation,
  updateRatingValidation,
  ratingIdParamValidation,
} from "./rating.validation";

const router = Router();

// ── Specific named routes FIRST (before /:id wildcard) ───────────────────────

// Any authenticated role
router.get("/user/me", authenticateJwt, getMyRatings);

// Public — store ratings
router.get("/store/:storeId", getRatingsByStore);

// Normal User only — submit / modify
router.post("/", authenticateJwt, authorize("NORMAL_USER"), createRatingValidation, catchError, createRating);
router.put("/:id", authenticateJwt, authorize("NORMAL_USER"), updateRatingValidation, catchError, updateRating);

// Normal User (own) or Admin — delete
router.delete("/:id", authenticateJwt, authorize("NORMAL_USER", "ADMIN"), ratingIdParamValidation, catchError, deleteRating);

// ── Wildcard last ─────────────────────────────────────────────────────────────
// Public — single rating detail
router.get("/:id", ratingIdParamValidation, catchError, getRatingById);

export default router;
