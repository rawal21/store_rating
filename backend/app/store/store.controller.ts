import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import * as storeService from "./store.service";
import { createResponse } from "@/common/dio/response.dto";
import type { AuthRequest } from "@/common/middleware/auth.middleware";
import type { IStoreCreate, IStoreUpdate } from "./store.dto";

// GET /api/stores  (public)
export const getAllStores = expressAsyncHandler(async (req: AuthRequest, res) => {
  const { name, email, address, sortBy, sortOrder } = req.query as Record<string, string>;
  const stores = await storeService.getFilteredStores({ name, email, address, sortBy, sortOrder });
  res.send(createResponse(stores));
});

// GET /api/stores/:id  (public – optionally authenticated)
export const getStoreById = expressAsyncHandler(async (req: AuthRequest, res) => {
  const store = await storeService.getStoreWithRatings(req.params.id, req.user?.id);
  if (!store) throw createHttpError(404, "Store not found");
  res.send(createResponse(store));
});

// POST /api/stores  (ADMIN only)
export const createStore = expressAsyncHandler(async (req: AuthRequest, res) => {
  const store = await storeService.createStore(req.body as IStoreCreate);
  res.status(201).send(createResponse(store, "Store created successfully"));
});

// PUT /api/stores/:id  (ADMIN only)
export const updateStore = expressAsyncHandler(async (req: AuthRequest, res) => {
  const store = await storeService.updateStore(req.params.id, req.body as IStoreUpdate);
  res.send(createResponse(store, "Store updated successfully"));
});

// DELETE /api/stores/:id  (ADMIN only)
export const deleteStore = expressAsyncHandler(async (req: AuthRequest, res) => {
  const store = await storeService.deleteStore(req.params.id);
  res.send(createResponse(store, "Store deleted successfully"));
});

// GET /api/stores/owner/my-stores  (STORE_OWNER only)
export const getMyStores = expressAsyncHandler(async (req: AuthRequest, res) => {
  const stores = await storeService.getStoresByOwner(req.user!.id);
  res.send(createResponse(stores));
});

// GET /api/stores/owner/dashboard  (STORE_OWNER only)
export const getStoreOwnerDashboard = expressAsyncHandler(async (req: AuthRequest, res) => {
  const dashboard = await storeService.getOwnerDashboard(req.user!.id);
  res.send(createResponse(dashboard));
});
