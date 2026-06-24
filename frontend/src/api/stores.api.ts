import { api } from "./axios.instance";
import type { ApiResponse, PaginatedResponse, IStore, IStoreCreate, IOwnerDashboardStore, StoreFilters } from "@/types";

export const storesApi = {
  getAll: (filters?: StoreFilters) =>
    api.get<ApiResponse<PaginatedResponse<IStore>>>("/stores", { params: filters }),

  getById: (id: string) =>
    api.get<ApiResponse<IStore>>(`/stores/${id}`),

  create: (data: IStoreCreate) =>
    api.post<ApiResponse<IStore>>("/stores", data),

  update: (id: string, data: Partial<IStoreCreate>) =>
    api.put<ApiResponse<IStore>>(`/stores/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<IStore>>(`/stores/${id}`),

  getMyStores: () =>
    api.get<ApiResponse<IStore[]>>("/stores/owner/my-stores"),

  getOwnerDashboard: () =>
    api.get<ApiResponse<IOwnerDashboardStore[]>>("/stores/owner/dashboard"),
};
