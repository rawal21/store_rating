import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser, ILoginResponse } from "@/types";

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const loadFromStorage = (): AuthState => {
  try {
    return {
      user: JSON.parse(localStorage.getItem("user") ?? "null"),
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
      isAuthenticated: !!localStorage.getItem("accessToken"),
    };
  } catch {
    return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadFromStorage,
  reducers: {
    setCredentials: (state, action: PayloadAction<ILoginResponse>) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, updateTokens, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
