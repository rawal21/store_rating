import { body, query, param } from "express-validator";

export const createStoreValidation = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Store name is required"),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),

  body("address")
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage("Address is required and must be at most 400 characters"),

  body("ownerId")
    .optional({ nullable: true })
    .isUUID()
    .withMessage("Owner ID must be a valid UUID"),
];

export const updateStoreValidation = [
  body("name").optional().trim().isLength({ min: 1 }).withMessage("Store name cannot be empty"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address must be at most 400 characters"),

  body("ownerId")
    .optional({ nullable: true })
    .isUUID()
    .withMessage("Owner ID must be a valid UUID"),
];

export const listStoresQueryValidation = [
  query("name").optional().trim(),
  query("email").optional().trim(),
  query("address").optional().trim(),
  query("sortBy")
    .optional()
    .isIn(["name", "email", "address", "createdAt"])
    .withMessage("Invalid sortBy field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be asc or desc"),
];

export const searchStoresQueryValidation = [
  query("name").optional().trim(),
  query("email").optional().trim(),
  query("address").optional().trim(),
];

export const storeIdParamValidation = [
  param("id").isUUID().withMessage("Invalid store ID"),
];
