import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";

interface Props {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders children only if the authenticated user has one of the allowed roles.
 * Use for in-page conditional rendering (not route-level protection — use ProtectedRoute for that).
 */
const RoleGuard = ({ roles, children, fallback = null }: Props) => {
  const { hasRole } = useAuth();
  return hasRole(...roles) ? <>{children}</> : <>{fallback}</>;
};

export default RoleGuard;
