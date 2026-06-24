import bcrypt from "bcrypt";
import type { IUser, IUserCreate } from "./user.dto";
import { getPrisma } from "@/common/service/database.service";

const prisma = getPrisma();

export const createUser = async (data: IUserCreate): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      address: data.address,
      role: data.role || "NORMAL_USER",
    },
  });
};

export const getUserById = async (id: string, select?: object): Promise<IUser | null> => {
  return prisma.user.findUnique({
    where: { id },
    ...(select ? { select } : {}),
  }) as Promise<IUser | null>;
};

export const getUserByEmail = async (email: string, select?: object): Promise<IUser | null> => {
  return prisma.user.findUnique({
    where: { email },
    ...(select ? { select } : {}),
  }) as Promise<IUser | null>;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  }) as Promise<IUser[]>;
};

/**
 * Filtered + sorted user list for admin dashboard.
 * Supports filtering by name, email, address, role and sorting on key fields.
 */
export const getFilteredUsers = async (filters: {
  name?: string;
  email?: string;
  address?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Omit<IUser, "passwordHash">[]; total: number; page: number; limit: number; totalPages: number }> => {
  const { name, email, address, role, sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 10 } = filters;

  const allowedSortFields = ["name", "email", "address", "role", "createdAt"];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const orderDir = sortOrder === "asc" ? "asc" : "desc";

  const where = {
    ...(name ? { name: { contains: name, mode: "insensitive" as const } } : {}),
    ...(email ? { email: { contains: email, mode: "insensitive" as const } } : {}),
    ...(address ? { address: { contains: address, mode: "insensitive" as const } } : {}),
    ...(role ? { role: role as any } : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { [orderField]: orderDir },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return { data: users as Omit<IUser, "passwordHash">[], total, page, limit, totalPages: Math.ceil(total / limit) };
};

/**
 * Get user by ID with their average store rating if they are a STORE_OWNER.
 */
export const getUserByIdWithRating = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      ownedStores: {
        select: {
          id: true,
          name: true,
          ratings: {
            select: { value: true },
          },
        },
      },
    },
  });

  if (!user) return null;

  // Compute average rating for store owners
  if (user.role === "STORE_OWNER") {
    const allRatings = user.ownedStores.flatMap((s) => s.ratings.map((r) => r.value));
    const averageRating =
      allRatings.length > 0
        ? Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10
        : 0;
    const { ownedStores, ...rest } = user;
    return {
      ...rest,
      averageRating,
      stores: ownedStores.map((s) => ({
        id: s.id,
        name: s.name,
        totalRatings: s.ratings.length,
      })),
    };
  }

  const { ownedStores, ...rest } = user;
  return rest;
};

export const updateUser = async (id: string, data: Partial<IUserCreate>): Promise<IUser> => {
  const updateData: any = { ...data };
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
    delete updateData.password;
  }
  return prisma.user.update({
    where: { id },
    data: updateData,
  });
};

export const deleteUser = async (id: string): Promise<IUser> => {
  return prisma.user.delete({
    where: { id },
  });
};
