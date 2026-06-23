import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/shared/ThemeToggle";
import StoreIcon from "@/assets/svgs/StoreIcon";
import RoleGuard from "@/components/shared/RoleGuard";
import { getRoleLabel, ROLE_COLORS } from "@/utils/roleLabel";
import Badge from "@/components/ui/Badge";

const NAV_LINKS = {
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users",     label: "Users" },
    { to: "/admin/stores",    label: "Stores" },
  ],
  NORMAL_USER: [
    { to: "/stores",   label: "Stores" },
    { to: "/profile",  label: "Profile" },
  ],
  STORE_OWNER: [
    { to: "/owner/dashboard", label: "Dashboard" },
    { to: "/profile",         label: "Profile" },
  ],
};

const AppLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const links = user ? (NAV_LINKS[user.role] ?? []) : [];

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="p-1.5 bg-primary-600 rounded-lg text-white">
            <StoreIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-sm">Store Rating</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          {user && (
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              <div className="mt-1">
                <Badge label={getRoleLabel(user.role)} className={ROLE_COLORS[user.role]} />
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors py-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="md:hidden flex items-center gap-2">
            <div className="p-1.5 bg-primary-600 rounded-lg text-white">
              <StoreIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-gray-900 dark:text-white">Store Rating</span>
          </div>

          <div className="hidden md:block" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <RoleGuard roles={["ADMIN", "NORMAL_USER", "STORE_OWNER"]}>
              {user && (
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                  {user.name.split(" ")[0]}
                </span>
              )}
            </RoleGuard>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
