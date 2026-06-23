import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import toastReducer from "./toast.slice";
import themeReducer from "./theme.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
