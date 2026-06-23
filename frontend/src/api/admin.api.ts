import { api } from "./axios.instance";
import type { ApiResponse, IDashboardStats } from "@/types";

export const adminApi = {
  getDashboard: () =>
    api.get<ApiResponse<IDashboardStats>>("/admin/dashboard"),
};
