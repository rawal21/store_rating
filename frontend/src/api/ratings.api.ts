import { api } from "./axios.instance";
import type { ApiResponse, IRating } from "@/types";

export const ratingsApi = {
  create: (data: { storeId: string; value: number }) =>
    api.post<ApiResponse<IRating>>("/ratings", data),

  update: (id: string, value: number) =>
    api.put<ApiResponse<IRating>>(`/ratings/${id}`, { value }),

  delete: (id: string) =>
    api.delete<ApiResponse<IRating>>(`/ratings/${id}`),

  getMyRatings: () =>
    api.get<ApiResponse<IRating[]>>("/ratings/user/me"),

  getByStore: (storeId: string) =>
    api.get<ApiResponse<IRating[]>>(`/ratings/store/${storeId}`),
};
