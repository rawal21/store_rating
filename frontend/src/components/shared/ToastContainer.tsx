import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { removeToast, type ToastType } from "@/store/toast.slice";

const TOAST_COLORS: Record<ToastType, string> = {
  success: "bg-green-500",
  error:   "bg-red-500",
  warning: "bg-yellow-500",
  info:    "bg-blue-500",
};

const TOAST_ICONS: Record<ToastType, string> = {
  success: "✓",
  error:   "✕",
  warning: "⚠",
  info:    "ℹ",
};

const AUTO_DISMISS_MS = 4000;

const ToastItem = ({ id, type, message }: { id: string; type: ToastType; message: string }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(id)), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [id, dispatch]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 px-4 py-3 rounded-lg text-white shadow-lg text-sm min-w-[240px] max-w-sm
        animate-[slideInRight_0.25s_ease] ${TOAST_COLORS[type]}`}
    >
      <span className="font-bold text-base leading-none mt-0.5" aria-hidden="true">
        {TOAST_ICONS[type]}
      </span>
      <span className="flex-1 leading-snug">{message}</span>
      <button
        onClick={() => dispatch(removeToast(id))}
        className="ml-2 opacity-75 hover:opacity-100 text-base leading-none bg-transparent border-none text-white cursor-pointer"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};

/**
 * Renders all active toasts in a fixed portal at the top-right.
 * Mount once in App.tsx.
 */
const ToastContainer = () => {
  const toasts = useAppSelector((s) => s.toast.toasts);

  return createPortal(
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
