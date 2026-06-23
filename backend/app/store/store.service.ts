import type { IStore, IStoreCreate, IStoreUpdate, IStoreResponse } from "./store.dto";
import { getPrisma } from "@/common/service/database.service";

const prisma = getPrisma();

export const createStore = async (data: IStoreCreate): Promise<IStore> => {
  return prisma.store.create({
    data: {
      name: data.name,
      email: data.email,
      address: data.address,
      ownerId: data.ownerId || null,
    },
  });
};

export const getStoreById = async (id: string): Promise<IStore | null> => {
  return prisma.store.findUnique({ where: { id } });
};

export const getAllStores = async (): Promise<IStore[]> => {
  return prisma.store.findMany({ orderBy: { createdAt: "desc" } });
};

/**
 * Filtered + sorted store list (admin dashboard, public listing).
 */
export const getFilteredStores = async (filters: {
  name?: string;
  email?: string;
  address?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<IStoreResponse[]> => {
  const { name, email, address, sortBy = "createdAt", sortOrder = "desc" } = filters;

  const allowedSortFields = ["name", "email", "address", "createdAt"];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const orderDir = sortOrder === "asc" ? "asc" : "desc";

  const stores = await prisma.store.findMany({
    where: {
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      ...(email ? { email: { contains: email, mode: "insensitive" } } : {}),
      ...(address ? { address: { contains: address, mode: "insensitive" } } : {}),
    },
    include: {
      ratings: { select: { value: true } },
    },
    orderBy: { [orderField]: orderDir },
  });

  return stores.map((store) => {
    const ratings = store.ratings;
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? Math.round((ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings) * 10) / 10
        : 0;
    const { ratings: _r, ...rest } = store;
    return { ...rest, averageRating, totalRatings };
  });
};

export const getStoresByOwner = async (ownerId: string): Promise<IStore[]> => {
  return prisma.store.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateStore = async (id: string, data: IStoreUpdate): Promise<IStore> => {
  return prisma.store.update({ where: { id }, data });
};

export const deleteStore = async (id: string): Promise<IStore> => {
  return prisma.store.delete({ where: { id } });
};

/**
 * Store detail with average rating and optionally the requesting user's own rating.
 */
export const getStoreWithRatings = async (
  id: string,
  requestingUserId?: string
): Promise<IStoreResponse | null> => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      ratings: {
        select: {
          value: true,
          userId: true,
        },
      },
    },
  });

  if (!store) return null;

  const ratings = store.ratings;
  const totalRatings = ratings.length;
  const averageRating =
    totalRatings > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings) * 10) / 10
      : 0;

  const userRating = requestingUserId
    ? ratings.find((r) => r.userId === requestingUserId)?.value ?? null
    : undefined;

  const { ratings: _r, ...rest } = store;
  return {
    ...rest,
    averageRating,
    totalRatings,
    ...(requestingUserId !== undefined ? { userRating } : {}),
  };
};

export const searchStores = async (query: string): Promise<IStore[]> => {
  return prisma.store.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Store owner dashboard: list of raters + average rating for all owned stores.
 */
export const getOwnerDashboard = async (ownerId: string) => {
  const stores = await prisma.store.findMany({
    where: { ownerId },
    include: {
      ratings: {
        select: {
          value: true,
          userId: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return stores.map((store) => {
    const ratings = store.ratings;
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? Math.round((ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings) * 10) / 10
        : 0;

    return {
      storeId: store.id,
      storeName: store.name,
      storeEmail: store.email,
      storeAddress: store.address,
      averageRating,
      totalRatings,
      raters: ratings.map((r) => ({
        userId: r.userId,
        name: (r.user as any).name,
        email: (r.user as any).email,
        rating: r.value,
        ratedAt: r.createdAt,
      })),
    };
  });
};
