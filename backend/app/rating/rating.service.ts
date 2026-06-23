import type { IRating, IRatingCreate, IRatingUpdate, IRatingResponse, IStoreRatingSummary } from "./rating.dto";
import { getPrisma } from "@/common/service/database.service";

const prisma = getPrisma();

export const createRating = async (data: IRatingCreate): Promise<IRating> => {
  return prisma.rating.create({
    data: {
      value: data.value,
      userId: data.userId,
      storeId: data.storeId,
    },
  });
};

export const getRatingById = async (id: string): Promise<IRating | null> => {
  return prisma.rating.findUnique({
    where: { id },
  });
};

export const getRatingByUserAndStore = async (userId: string, storeId: string): Promise<IRating | null> => {
  return prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
  });
};

export const getRatingsByUser = async (userId: string): Promise<IRating[]> => {
  return prisma.rating.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getRatingsByStore = async (storeId: string): Promise<IRating[]> => {
  return prisma.rating.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateRating = async (id: string, data: IRatingUpdate): Promise<IRating> => {
  return prisma.rating.update({
    where: { id },
    data: {
      value: data.value,
    },
  });
};

export const deleteRating = async (id: string): Promise<IRating> => {
  return prisma.rating.delete({
    where: { id },
  });
};

export const getRatingWithDetails = async (id: string): Promise<IRatingResponse | null> => {
  const rating = await prisma.rating.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      store: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!rating) return null;

  return {
    id: rating.id,
    value: rating.value,
    userId: rating.userId,
    storeId: rating.storeId,
    userName: (rating.user as any).name,
    storeName: (rating.store as any).name,
    createdAt: rating.createdAt,
    updatedAt: rating.updatedAt,
  };
};

export const getStoreRatingSummary = async (storeId: string): Promise<IStoreRatingSummary | null> => {
  const ratings = await prisma.rating.findMany({
    where: { storeId },
    select: {
      value: true,
    },
  });

  if (ratings.length === 0) {
    return {
      storeId,
      averageRating: 0,
      totalRatings: 0,
    };
  }

  const totalRatings = ratings.length;
  const sum = ratings.reduce((acc, r) => acc + r.value, 0);
  const averageRating = Math.round((sum / totalRatings) * 10) / 10;

  return {
    storeId,
    averageRating,
    totalRatings,
  };
};

export const getAllRatings = async (): Promise<IRating[]> => {
  return prisma.rating.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getTopRatedStores = async (limit: number = 10): Promise<any[]> => {
  const stores = await prisma.store.findMany({
    include: {
      ratings: {
        select: {
          value: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return stores
    .map((store) => {
      const ratings = store.ratings;
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings
        : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
      };
    })
    .sort((a, b) => b.averageRating - a.averageRating);
};