import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useToast } from "@/hooks/useToast";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/utils/apiError";
import { getRoleLabel } from "@/utils/roleLabel";
import StatCard from "@/components/ui/StatCard";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import type { IDashboardStats } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

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

const ROLE_COLORS_MAP: Record<string, string> = {
  ADMIN:        "#7c3aed",
  NORMAL_USER:  "#2563eb",
  STORE_OWNER:  "#16a34a",
};

const STAR_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

const ChartCard = ({ title, children, loading }: { title: string; children: React.ReactNode; loading: boolean }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
    {loading ? <Skeleton className="h-56 w-full" /> : children}
  </div>
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

  // Prepare chart data
  const roleChartData = stats?.roleChart.map((r) => ({
    name: getRoleLabel(r.role as any),
    value: r.count,
    fill: ROLE_COLORS_MAP[r.role] ?? "#6b7280",
  })) ?? [];

  const ratingData = stats?.ratingDistribution.map((r) => ({
    name: `${r.star}★`,
    count: r.count,
  })) ?? [];

  const topStoresData = stats?.topRatedStores ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Platform overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          <><CardSkeleton /><CardSkeleton /><CardSkeleton /></>
        ) : stats ? (
          <>
            <StatCard label="Total Users"   value={stats.totalUsers}   icon={<UserIcon />}    color="bg-blue-50 dark:bg-blue-900/30" />
            <StatCard label="Total Stores"  value={stats.totalStores}  icon={<StoreIconSm />} color="bg-green-50 dark:bg-green-900/30" />
            <StatCard label="Total Ratings" value={stats.totalRatings} icon={<StarIconSm />}  color="bg-yellow-50 dark:bg-yellow-900/30" />
          </>
        ) : null}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Users by role — Donut */}
        <ChartCard title="Users by Role" loading={loading}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={roleChartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {roleChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [v, n]} />
              <Legend
                formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Rating distribution — Bar */}
        <ChartCard title="Rating Distribution (1★ – 5★)" loading={loading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ratingData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Ratings" radius={[4, 4, 0, 0]}>
                {ratingData.map((_, i) => (
                  <Cell key={i} fill={STAR_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top rated stores — Horizontal bar */}
      {!loading && topStoresData.length > 0 && (
        <ChartCard title="Top Rated Stores" loading={false}>
          <ResponsiveContainer width="100%" height={Math.max(180, topStoresData.length * 44)}>
            <BarChart
              data={topStoresData}
              layout="vertical"
              margin={{ top: 4, right: 48, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
              <Tooltip
                formatter={(v: number) => [`${v.toFixed(1)} / 5`, "Avg Rating"]}
              />
              <Bar dataKey="averageRating" name="Avg Rating" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

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
