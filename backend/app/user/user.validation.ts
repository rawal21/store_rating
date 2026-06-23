import { body, query, param } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),

  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain at least one special character"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 400 })
    .withMessage("Address must be at most 400 characters"),
];

export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

export const updatePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("New password must be 8-16 characters")
    .matches(/[A-Z]/)
    .withMessage("New password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("New password must contain at least one special character"),
];

export const createUserByAdminValidation = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),

  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain at least one special character"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 400 })
    .withMessage("Address must be at most 400 characters"),

  body("role")
    .optional()
    .isIn(["ADMIN", "NORMAL_USER", "STORE_OWNER"])
    .withMessage("Role must be ADMIN, NORMAL_USER, or STORE_OWNER"),
];

export const listUsersQueryValidation = [
  query("name").optional().trim(),
  query("email").optional().trim(),
  query("address").optional().trim(),
  query("role")
    .optional()
    .isIn(["ADMIN", "NORMAL_USER", "STORE_OWNER"])
    .withMessage("Invalid role filter"),
  query("sortBy")
    .optional()
    .isIn(["name", "email", "address", "role", "createdAt"])
    .withMessage("Invalid sortBy field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be asc or desc"),
];

export const userIdParamValidation = [
  param("id").isUUID().withMessage("Invalid user ID"),
];
