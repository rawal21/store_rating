import { body, param } from "express-validator";

export const createRatingValidation = [
  body("storeId").isUUID().withMessage("storeId must be a valid UUID"),

  body("value")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating value must be an integer between 1 and 5"),
];

export const updateRatingValidation = [
  param("id").isUUID().withMessage("Invalid rating ID"),

  body("value")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating value must be an integer between 1 and 5"),
];

export const ratingIdParamValidation = [
  param("id").isUUID().withMessage("Invalid rating ID"),
];
