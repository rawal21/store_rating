import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useToast } from "@/hooks/useToast";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/utils/apiError";
import StatCard from "@/components/ui/StatCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import type { IDashboardStats } from "@/types";

const UserIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.5M9 20H4v-2a4 4 0 015-3.5m0 0a4 4 0 118 0m-8 0a4 4 0 008 0M12 12a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);
const StoreIconSm = () => (
  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M3 3l1.5 9h15L21 3M3 3H1m20 0h2M9 21h6M10 12h4m-2-2v4" />
  </svg>
);
const StarIconSm = () => (
  <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.5 9l6.6-.9z" />
  </svg>
);

const AdminDashboard = () => {
  usePageTitle("Admin Dashboard");
  const toast = useToast();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then((r) => setStats(r.data.data))
      .catch((e) => toast.error(getErrorMessage(e)))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Platform overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          <>
            <CardSkeleton /><CardSkeleton /><CardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatCard label="Total Users"   value={stats.totalUsers}   icon={<UserIcon />}    color="bg-blue-50 dark:bg-blue-900/30" />
            <StatCard label="Total Stores"  value={stats.totalStores}  icon={<StoreIconSm />} color="bg-green-50 dark:bg-green-900/30" />
            <StatCard label="Total Ratings" value={stats.totalRatings} icon={<StarIconSm />}  color="bg-yellow-50 dark:bg-yellow-900/30" />
          </>
        ) : null}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/admin/users"
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group">
          <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
            Manage Users →
          </p>
          <p className="text-sm text-gray-400 mt-1">View, filter, create and delete users</p>
        </a>
        <a href="/admin/stores"
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group">
          <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
            Manage Stores →
          </p>
          <p className="text-sm text-gray-400 mt-1">Add, edit and assign store owners</p>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
