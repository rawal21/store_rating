import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import * as userService from "./user.service";
import { createUserTokens, isValidPassword, verifyToken } from "@/common/service/jwt-service";
import { createResponse } from "@/common/dio/response.dto";
import type { AuthRequest } from "@/common/middleware/auth.middleware";
import type { IUserCreate } from "./user.dto";

// POST /api/users/register  (public)
export const register = expressAsyncHandler(async (req: AuthRequest, res) => {
  const data: IUserCreate = req.body;
  data.role = "NORMAL_USER";
  const user = await userService.createUser(data);
  const { passwordHash, ...safeUser } = user as any;
  res.send(createResponse(safeUser, "User registered successfully"));
});

// POST /api/users/login  (public)
export const login = expressAsyncHandler(async (req: AuthRequest, res) => {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email, {
    id: true, name: true, email: true,
    address: true, role: true, passwordHash: true,
    createdAt: true, updatedAt: true,
  });

  if (!user) throw createHttpError(401, "Invalid email or password");

  const validPass = await isValidPassword(password, (user as any).passwordHash);
  if (!validPass) throw createHttpError(401, "Invalid email or password");

  const { passwordHash, ...safeUser } = user as any;
  const tokens = createUserTokens(safeUser);
  res.send(createResponse({ user: safeUser, ...tokens }, "Login successful"));
});

// POST /api/users/refresh-token  (public)
export const refreshToken = expressAsyncHandler(async (req: AuthRequest, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw createHttpError(400, "Refresh token is required");

  let decoded: any;
  try {
    decoded = verifyToken(token);
  } catch {
    // verifyToken throws a JWT error — map it to 401
    throw createHttpError(401, "Invalid or expired refresh token");
  }

  const user = await userService.getUserById(decoded.id ?? decoded.sub, {
    id: true, name: true, email: true,
    address: true, role: true, createdAt: true, updatedAt: true,
  });

  if (!user) throw createHttpError(401, "User no longer exists");

  const tokens = createUserTokens(user as any);
  res.send(createResponse(tokens, "Token refreshed successfully"));
});

// GET /api/users/me  (any authenticated role)
export const getMe = expressAsyncHandler(async (req: AuthRequest, res) => {
  const user = await userService.getUserByIdWithRating(req.user!.id);
  if (!user) throw createHttpError(404, "User not found");
  res.send(createResponse(user));
});

// PUT /api/users/me/password  (any authenticated role)
export const updatePassword = expressAsyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;

  const user = await userService.getUserById(userId, { id: true, passwordHash: true });
  if (!user) throw createHttpError(404, "User not found");

  const valid = await isValidPassword(currentPassword, (user as any).passwordHash);
  if (!valid) throw createHttpError(400, "Current password is incorrect");

  await userService.updateUser(userId, { password: newPassword });
  res.send(createResponse(null, "Password updated successfully"));
});

// GET /api/users  (ADMIN only)
export const getAllUsers = expressAsyncHandler(async (req: AuthRequest, res) => {
  const { name, email, address, role, sortBy, sortOrder } = req.query as Record<string, string>;
  const users = await userService.getFilteredUsers({ name, email, address, role, sortBy, sortOrder });
  res.send(createResponse(users));
});

// GET /api/users/:id  (ADMIN or self)
export const getUserById = expressAsyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  if (req.user!.role !== "ADMIN" && req.user!.id !== id) {
    throw createHttpError(403, "Access denied");
  }
  const user = await userService.getUserByIdWithRating(id);
  if (!user) throw createHttpError(404, "User not found");
  res.send(createResponse(user));
});

// POST /api/users  (ADMIN only)
export const createUserByAdmin = expressAsyncHandler(async (req: AuthRequest, res) => {
  const data: IUserCreate = req.body;
  const user = await userService.createUser(data);
  const { passwordHash, ...safeUser } = user as any;
  res.status(201).send(createResponse(safeUser, "User created successfully"));
});

// DELETE /api/users/:id  (ADMIN only)
export const deleteUser = expressAsyncHandler(async (req: AuthRequest, res) => {
  const user = await userService.deleteUser(req.params.id);
  const { passwordHash, ...safeUser } = user as any;
  res.send(createResponse(safeUser, "User deleted successfully"));
});
