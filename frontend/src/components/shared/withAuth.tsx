import { useAuth } from "@/hooks/useAuth";
import type { IUser } from "@/types";

export interface WithAuthProps {
  currentUser: IUser;
}

/**
 * HOC — injects `currentUser` prop into the wrapped component.
 * The wrapped component is only rendered when a user is authenticated,
 * so `currentUser` is guaranteed non-null inside it.
 *
 * Usage:
 *   const ProfileWithUser = withAuth(ProfileCard);
 *   <ProfileWithUser />  ← no need to pass currentUser manually
 */
function withAuth<T extends WithAuthProps>(
  WrappedComponent: React.ComponentType<T>
) {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? "Component";

  const ComponentWithAuth = (props: Omit<T, keyof WithAuthProps>) => {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated || !user) return null;
    return <WrappedComponent {...(props as T)} currentUser={user} />;
  };

  ComponentWithAuth.displayName = `withAuth(${displayName})`;
  return ComponentWithAuth;
}

export default withAuth;
