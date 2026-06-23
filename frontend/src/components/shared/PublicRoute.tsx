import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  NORMAL_USER: "/stores",
  STORE_OWNER: "/owner/dashboard",
};

/**
 * Redirects already-authenticated users to their role home page.
 * Used to wrap /login and /register.
 */
const PublicRoute = ({ children }: Props) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_HOME[user.role] ?? "/stores"} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
