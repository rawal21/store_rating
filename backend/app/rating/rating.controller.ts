import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import * as ratingService from "./rating.service";
import { createResponse } from "@/common/dio/response.dto";
import type { AuthRequest } from "@/common/middleware/auth.middleware";

// POST /api/ratings  (NORMAL_USER only)
export const createRating = expressAsyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { storeId, value } = req.body;

  const existing = await ratingService.getRatingByUserAndStore(userId, storeId);
  if (existing) throw createHttpError(409, "You have already rated this store");

  const rating = await ratingService.createRating({ userId, storeId, value });
  res.status(201).send(createResponse(rating, "Rating submitted successfully"));
});

// PUT /api/ratings/:id  (NORMAL_USER only — own rating)
export const updateRating = expressAsyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const existing = await ratingService.getRatingById(id);
  if (!existing) throw createHttpError(404, "Rating not found");
  if (existing.userId !== req.user!.id) throw createHttpError(403, "You can only modify your own ratings");

  const rating = await ratingService.updateRating(id, { value: req.body.value });
  res.send(createResponse(rating, "Rating updated successfully"));
});

// DELETE /api/ratings/:id  (NORMAL_USER own, or ADMIN)
export const deleteRating = expressAsyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const existing = await ratingService.getRatingById(id);
  if (!existing) throw createHttpError(404, "Rating not found");

  if (req.user!.role !== "ADMIN" && existing.userId !== req.user!.id) {
    throw createHttpError(403, "Access denied");
  }

  const rating = await ratingService.deleteRating(id);
  res.send(createResponse(rating, "Rating deleted successfully"));
});

// GET /api/ratings/:id  (public)
export const getRatingById = expressAsyncHandler(async (req: AuthRequest, res) => {
  const rating = await ratingService.getRatingWithDetails(req.params.id);
  if (!rating) throw createHttpError(404, "Rating not found");
  res.send(createResponse(rating));
});

// GET /api/ratings/store/:storeId  (public)
export const getRatingsByStore = expressAsyncHandler(async (req: AuthRequest, res) => {
  const ratings = await ratingService.getRatingsByStore(req.params.storeId);
  res.send(createResponse(ratings));
});

// GET /api/ratings/user/me  (any authenticated role)
export const getMyRatings = expressAsyncHandler(async (req: AuthRequest, res) => {
  const ratings = await ratingService.getRatingsByUser(req.user!.id);
  res.send(createResponse(ratings));
});
