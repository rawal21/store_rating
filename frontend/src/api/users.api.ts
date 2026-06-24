import { api } from "./axios.instance";
import type { ApiResponse, PaginatedResponse, IUser, IUserCreate, UserFilters } from "@/types";

export const usersApi = {
  getMe: () =>
    api.get<ApiResponse<IUser>>("/users/me"),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse<null>>("/users/me/password", data),

  getAll: (filters?: UserFilters) =>
    api.get<ApiResponse<PaginatedResponse<IUser>>>("/users", { params: filters }),

  getById: (id: string) =>
    api.get<ApiResponse<IUser>>(`/users/${id}`),

  create: (data: IUserCreate) =>
    api.post<ApiResponse<IUser>>("/users", data),

  delete: (id: string) =>
    api.delete<ApiResponse<IUser>>(`/users/${id}`),
};
