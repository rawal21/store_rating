import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLoader from "@/components/shared/PageLoader";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import PublicRoute from "@/components/shared/PublicRoute";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import ToastContainer from "@/components/shared/ToastContainer";

// ── Auth ──────────────────────────────────────────────────────────────────────
const Landing      = lazy(() => import("@/pages/Landing"));
const Login        = lazy(() => import("@/pages/auth/Login"));
const Register     = lazy(() => import("@/pages/auth/Register"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));
const NotFound     = lazy(() => import("@/pages/NotFound"));

// ── Normal User ───────────────────────────────────────────────────────────────
const Stores  = lazy(() => import("@/pages/user/Stores"));
const Profile = lazy(() => import("@/pages/user/Profile"));

// ── Admin ─────────────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers     = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminStores    = lazy(() => import("@/pages/admin/AdminStores"));

// ── Store Owner ───────────────────────────────────────────────────────────────
const OwnerDashboard = lazy(() => import("@/pages/owner/OwnerDashboard"));

const App = () => {
  return (
    <BrowserRouter>
      {/* Global toast portal */}
      <ToastContainer />

      {/* Top-level error boundary catches any render crash */}
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public auth ── */}
            <Route element={<AuthLayout />}>
              <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            </Route>

            {/* ── Authenticated shell (AppLayout wraps all authed pages) ── */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Normal User */}
              <Route
                path="/stores"
                element={
                  <ProtectedRoute allowedRoles={["NORMAL_USER", "ADMIN"]}>
                    <Stores />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Profile />} />

              {/* Admin */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/users"
                element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminUsers /></ProtectedRoute>}
              />
              <Route
                path="/admin/stores"
                element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminStores /></ProtectedRoute>}
              />

              {/* Store Owner */}
              <Route
                path="/owner/dashboard"
                element={<ProtectedRoute allowedRoles={["STORE_OWNER"]}><OwnerDashboard /></ProtectedRoute>}
              />
            </Route>

            {/* ── Misc ── */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/404"          element={<NotFound />} />
            <Route path="/"             element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="*"             element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
