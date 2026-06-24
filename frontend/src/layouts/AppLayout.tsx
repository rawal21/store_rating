import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { updateUser } from "@/store/auth.slice";
import { usersApi } from "@/api/users.api";
import ThemeToggle from "@/components/shared/ThemeToggle";
import StoreIcon from "@/assets/svgs/StoreIcon";
import StarRating from "@/components/shared/StarRating";
import { getRoleLabel, ROLE_COLORS } from "@/utils/roleLabel";
import Badge from "@/components/ui/Badge";

const NAV_LINKS = {
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { to: "/admin/users",     label: "Users",     icon: "M17 20h5v-2a4 4 0 00-5-3.5M9 20H4v-2a4 4 0 015-3.5m0 0a4 4 0 118 0m-8 0a4 4 0 008 0M12 12a4 4 0 100-8 4 4 0 000 8z" },
    { to: "/admin/stores",    label: "Stores",    icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.501 20.651V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" },
  ],
  NORMAL_USER: [
    { to: "/stores",   label: "Stores",  icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.501 20.651V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" },
    { to: "/profile",  label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ],
  STORE_OWNER: [
    { to: "/owner/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { to: "/profile",         label: "Profile",   icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ],
};

const NavIcon = ({ path }: { path: string }) => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

/** Avatar circle with initials */
const Avatar = ({ name, size = "md" }: { name: string; size?: "sm" | "md" }) => {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold shrink-0`}>
      {initials}
    </div>
  );
};

const SidebarContent = ({ links, user, onNavClick, onLogout }: {
  links: typeof NAV_LINKS.ADMIN;
  user: ReturnType<typeof useAuth>["user"];
  onNavClick?: () => void;
  onLogout: () => void;
}) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    }`;

  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="p-1.5 bg-primary-600 rounded-lg text-white">
          <StoreIcon className="w-5 h-5" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">Store Rating</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={navLinkClass} onClick={onNavClick}>
            <NavIcon path={link.icon} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Profile + logout footer */}
      {user && (
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={user.name} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate leading-tight">
                {user.name.split(" ").slice(0, 2).join(" ")}
              </p>
              <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">{user.email}</p>
              <div className="mt-1">
                <Badge label={getRoleLabel(user.role)} className={`${ROLE_COLORS[user.role]} text-[10px] px-1.5 py-0`} />
              </div>
            </div>
          </div>

          {/* Store avg rating — shown only for STORE_OWNER */}
          {user.role === "STORE_OWNER" && user.averageRating !== undefined && (
            <div className="mb-3 px-1">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">Store Rating</p>
              <div className="flex items-center gap-1.5">
                <StarRating value={user.averageRating} readOnly size={14} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                  {user.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            <LogoutIcon />
            Sign out
          </button>
        </div>
      )}
    </>
  );
};

const AppLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Refresh user profile on mount to get latest averageRating for STORE_OWNER
  useEffect(() => {
    usersApi.getMe()
      .then((res) => dispatch(updateUser(res.data.data)))
      .catch(() => {});
  }, [dispatch]);

  const links = user ? (NAV_LINKS[user.role] ?? []) : [];

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
        <SidebarContent links={links} user={user} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile overlay ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
          flex flex-col transform transition-transform duration-250 ease-in-out md:hidden
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button inside drawer */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        <SidebarContent links={links} user={user} onNavClick={() => setDrawerOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            {/* Brand — mobile only */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="p-1.5 bg-primary-600 rounded-lg text-white">
                <StoreIcon className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-gray-900 dark:text-white">Store Rating</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Profile avatar in topbar — all screen sizes on desktop, hidden on mobile (shown in drawer) */}
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <Avatar name={user.name} size="sm" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block truncate max-w-[100px]">
                  {user.name.split(" ")[0]}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
