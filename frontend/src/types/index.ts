// ── Roles ─────────────────────────────────────────────────────────────────────
export type Role = "ADMIN" | "NORMAL_USER" | "STORE_OWNER";

// ── API response envelope ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error_code: number;
  message: string;
  data?: Record<string, unknown>;
}

// ── User ──────────────────────────────────────────────────────────────────────
export interface IUser {
  id: string;
  name: string;
  email: string;
  address: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;  // STORE_OWNER only
  stores?: { id: string; name: string; totalRatings: number }[]; // STORE_OWNER only
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: Role;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export interface IStore {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string | null;
  averageRating?: number;
  totalRatings?: number;
  userRating?: number | null;   // authenticated user's own rating value
  userRatingId?: string | null; // rating ID needed to edit
  createdAt: string;
  updatedAt: string;
}

export interface IStoreCreate {
  name: string;
  email: string;
  address: string;
  ownerId?: string | null;
}

// ── Rating ────────────────────────────────────────────────────────────────────
export interface IRating {
  id: string;
  value: number;
  userId: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRatingDetail extends IRating {
  userName?: string;
  storeName?: string;
}

// ── Store Owner Dashboard ─────────────────────────────────────────────────────
export interface IOwnerDashboardStore {
  storeId: string;
  storeName: string;
  storeEmail: string;
  storeAddress: string;
  averageRating: number;
  totalRatings: number;
  raters: {
    userId: string;
    name: string;
    email: string;
    rating: number;
    ratedAt: string;
  }[];
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
export interface IDashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  roleChart: { role: string; count: number }[];
  ratingDistribution: { star: number; count: number }[];
  topRatedStores: { name: string; averageRating: number; totalRatings: number }[];
}

// ── Query params ──────────────────────────────────────────────────────────────
export type SortOrder = "asc" | "desc";

export interface UserFilters {
  name?: string;
  email?: string;
  address?: string;
  role?: Role;
  sortBy?: "name" | "email" | "address" | "role" | "createdAt";
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface StoreFilters {
  name?: string;
  email?: string;
  address?: string;
  sortBy?: "name" | "email" | "address" | "createdAt";
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}
