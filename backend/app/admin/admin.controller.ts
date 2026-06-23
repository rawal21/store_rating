import expressAsyncHandler from "express-async-handler";
import { getPrisma } from "@/common/service/database.service";
import { createResponse } from "@/common/dio/response.dto";
import type { AuthRequest } from "@/common/middleware/auth.middleware";

const prisma = getPrisma();

// GET /api/admin/dashboard  (ADMIN only)
export const getDashboard = expressAsyncHandler(async (_req: AuthRequest, res) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  res.send(
    createResponse({ totalUsers, totalStores, totalRatings }, "Dashboard data fetched successfully")
  );
});
