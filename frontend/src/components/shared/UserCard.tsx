import withAuth, { type WithAuthProps } from "./withAuth";
import Badge from "@/components/ui/Badge";
import { getRoleLabel, ROLE_COLORS } from "@/utils/roleLabel";

/**
 * Displays the current user's name, email and role badge.
 * Wrapped with withAuth HOC — currentUser is injected, never null.
 */
const UserCard = ({ currentUser }: WithAuthProps) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
      {currentUser.name}
    </p>
    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
    <div className="pt-0.5">
      <Badge
        label={getRoleLabel(currentUser.role)}
        className={ROLE_COLORS[currentUser.role]}
      />
    </div>
  </div>
);

export default withAuth(UserCard);
