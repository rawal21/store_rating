import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: Toast[];
}

const toastSlice = createSlice({
  name: "toast",
  initialState: { toasts: [] } as ToastState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      state.toasts.push({ ...action.payload, id: crypto.randomUUID() });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
