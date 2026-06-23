import { useAppSelector, useAppDispatch } from "./useAppDispatch";
import { logout, setCredentials } from "@/store/auth.slice";
import { addToast } from "@/store/toast.slice";
import type { ILoginResponse, Role } from "@/types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, accessToken } = useAppSelector((s) => s.auth);

  const signIn = (payload: ILoginResponse) => {
    dispatch(setCredentials(payload));
  };

  const signOut = () => {
    dispatch(logout());
    dispatch(addToast({ type: "info", message: "You have been logged out" }));
  };

  const hasRole = (...roles: Role[]) => {
    return !!user && roles.includes(user.role);
  };

  return { user, isAuthenticated, accessToken, signIn, signOut, hasRole };
};
