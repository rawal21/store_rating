import { useAppDispatch } from "./useAppDispatch";
import { addToast, type ToastType } from "@/store/toast.slice";

export const useToast = () => {
  const dispatch = useAppDispatch();

  const toast = (message: string, type: ToastType = "info") => {
    dispatch(addToast({ message, type }));
  };

  return {
    success: (msg: string) => toast(msg, "success"),
    error: (msg: string) => toast(msg, "error"),
    warning: (msg: string) => toast(msg, "warning"),
    info: (msg: string) => toast(msg, "info"),
  };
};
