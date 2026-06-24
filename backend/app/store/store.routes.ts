import { Router, Request, Response, NextFunction } from "express";
import { authenticateJwt, authorize } from "@/common/middleware/auth.middleware";
import { catchError } from "@/common/middleware/catch-error.middlware";
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getMyStores,
  getStoreOwnerDashboard,
} from "./store.controller";
import {
  createStoreValidation,
  updateStoreValidation,
  listStoresQueryValidation,
  storeIdParamValidation,
} from "./store.validation";
import type { AuthRequest } from "@/common/middleware/auth.middleware";

const router = Router();

// ── Public + optional auth (list — attaches userRating when token present) ───
router.get("/", listStoresQueryValidation, catchError, (req: Request, res: Response, next: NextFunction) => {
  authenticateJwt(req as AuthRequest, res, (_err: unknown) => {
    return getAllStores(req as AuthRequest, res, next);
  });
});

// ── Store Owner only ──────────────────────────────────────────────────────────
// These must be declared before /:id to avoid being matched as a UUID param
router.get("/owner/my-stores", authenticateJwt, authorize("STORE_OWNER"), getMyStores);
router.get("/owner/dashboard", authenticateJwt, authorize("STORE_OWNER"), getStoreOwnerDashboard);

// ── Public + optional auth (to expose userRating) ────────────────────────────
router.get("/:id", storeIdParamValidation, catchError, (req: Request, res: Response, next: NextFunction) => {
  // Attempt auth silently – controller works with or without req.user
  authenticateJwt(req as AuthRequest, res, (_err: unknown) => {
    return getStoreById(req as AuthRequest, res, next);
  });
});

// ── Admin only ────────────────────────────────────────────────────────────────
router.post("/", authenticateJwt, authorize("ADMIN"), createStoreValidation, catchError, createStore);
router.put("/:id", authenticateJwt, authorize("ADMIN"), storeIdParamValidation, updateStoreValidation, catchError, updateStore);
router.delete("/:id", authenticateJwt, authorize("ADMIN"), storeIdParamValidation, catchError, deleteStore);

export default router;
