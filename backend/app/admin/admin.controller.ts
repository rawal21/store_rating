import expressAsyncHandler from "express-async-handler";
import { getPrisma } from "@/common/service/database.service";
import { createResponse } from "@/common/dio/response.dto";
import type { AuthRequest } from "@/common/middleware/auth.middleware";

const prisma = getPrisma();

// GET /api/admin/dashboard  (ADMIN only)
export const getDashboard = expressAsyncHandler(async (_req: AuthRequest, res) => {
  const [
    totalUsers, totalStores, totalRatings,
    usersByRole, ratingsByValue, topStores,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),

    // Users grouped by role
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),

    // Ratings grouped by value (1-5)
    prisma.rating.groupBy({ by: ["value"], _count: { _all: true }, orderBy: { value: "asc" } }),

    // Top 5 stores by average rating
    prisma.store.findMany({
      include: { ratings: { select: { value: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  // Build role breakdown for chart
  const roleChart = usersByRole.map((r) => ({
    role: r.role,
    count: r._count._all,
  }));

  // Build rating value distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map((v) => ({
    star: v,
    count: ratingsByValue.find((r) => r.value === v)?._count._all ?? 0,
  }));

  // Top 5 rated stores
  const topRatedStores = topStores
    .map((s) => {
      const ratings = s.ratings;
      const avg = ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b.value, 0) / ratings.length) * 10) / 10
        : 0;
      return { name: s.name, averageRating: avg, totalRatings: ratings.length };
    })
    .filter((s) => s.totalRatings > 0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5);

  res.send(
    createResponse({
      totalUsers, totalStores, totalRatings,
      roleChart, ratingDistribution, topRatedStores,
    }, "Dashboard data fetched successfully")
  );
});
