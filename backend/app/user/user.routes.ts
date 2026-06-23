import { Router } from "express";
import { authenticateJwt, authorize } from "@/common/middleware/auth.middleware";
import { catchError } from "@/common/middleware/catch-error.middlware";
import {
  register,
  login,
  refreshToken,
  getMe,
  updatePassword,
  getAllUsers,
  getUserById,
  createUserByAdmin,
  deleteUser,
} from "./user.controller";
import {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  createUserByAdminValidation,
  listUsersQueryValidation,
  userIdParamValidation,
} from "./user.validation";
import { body } from "express-validator";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/register", registerValidation, catchError, register);
router.post("/login", loginValidation, catchError, login);
router.post(
  "/refresh-token",
  [body("refreshToken").notEmpty().withMessage("refreshToken is required")],
  catchError,
  refreshToken
);

// ── Any authenticated role ────────────────────────────────────────────────────
router.get("/me", authenticateJwt, getMe);
router.put("/me/password", authenticateJwt, updatePasswordValidation, catchError, updatePassword);

// ── Admin only ────────────────────────────────────────────────────────────────
router.get("/", authenticateJwt, authorize("ADMIN"), listUsersQueryValidation, catchError, getAllUsers);
router.post("/", authenticateJwt, authorize("ADMIN"), createUserByAdminValidation, catchError, createUserByAdmin);
router.get("/:id", authenticateJwt, userIdParamValidation, catchError, getUserById);       // controller handles self vs admin
router.delete("/:id", authenticateJwt, authorize("ADMIN"), userIdParamValidation, catchError, deleteUser);

export default router;
