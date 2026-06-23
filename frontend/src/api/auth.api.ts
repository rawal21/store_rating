import { api } from "./axios.instance";
import type { ApiResponse, ILoginRequest, ILoginResponse, ITokens } from "@/types";

export const authApi = {
  login: (data: ILoginRequest) =>
    api.post<ApiResponse<ILoginResponse>>("/users/login", data),

  register: (data: { name: string; email: string; password: string; address: string }) =>
    api.post<ApiResponse<ILoginResponse>>("/users/register", data),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<ITokens>>("/users/refresh-token", { refreshToken }),
};
