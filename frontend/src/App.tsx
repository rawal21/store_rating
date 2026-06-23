import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageLoader from "@/components/shared/PageLoader";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import PublicRoute from "@/components/shared/PublicRoute";
import AuthLayout from "@/layouts/AuthLayout";

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const Login       = lazy(() => import("@/pages/auth/Login"));
const Register    = lazy(() => import("@/pages/auth/Register"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));

// Phase 3+ pages — placeholders until those phases are built
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">{title}</h1>
      <p className="text-gray-400 mt-2">Coming in the next phase</p>
    </div>
  </div>
);

const AdminDashboard  = lazy(() => Promise.resolve({ default: () => <PlaceholderPage title="Admin Dashboard" /> }));
const StoresPage      = lazy(() => Promise.resolve({ default: () => <PlaceholderPage title="Stores" /> }));
const OwnerDashboard  = lazy(() => Promise.resolve({ default: () => <PlaceholderPage title="Owner Dashboard" /> }));

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public auth routes ── */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={<PublicRoute><Login /></PublicRoute>}
            />
            <Route
              path="/register"
              element={<PublicRoute><Register /></PublicRoute>}
            />
          </Route>

          {/* ── Admin routes ── */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Normal user routes ── */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={["NORMAL_USER", "ADMIN"]}>
                <StoresPage />
              </ProtectedRoute>
            }
          />

          {/* ── Store owner routes ── */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Misc ── */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
