import { usePageTitle } from "@/hooks/usePageTitle";
import { useOwnerDashboard } from "@/hooks/useOwnerDashboard";
import { useAuth } from "@/hooks/useAuth";
import StarRating from "@/components/shared/StarRating";
import Table, { type Column } from "@/components/ui/Table";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/assets/svgs/EmptyState";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

type RaterRow = {
  userId: string;
  name: string;
  email: string;
  rating: number;
  ratedAt: string;
} & Record<string, unknown>;

const STAR_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

const ChartCard = ({ title, children, loading }: { title: string; children: React.ReactNode; loading: boolean }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
    {loading ? <Skeleton className="h-44 w-full" /> : children}
  </div>
);

const OwnerDashboard = () => {
  usePageTitle("My Dashboard");
  const { user } = useAuth();
  const { data, loading } = useOwnerDashboard();

  const raterColumns: Column<RaterRow>[] = [
    {
      key: "name",
      header: "User",
      sortable: false,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{String(row.name)}</p>
          <p className="text-xs text-gray-400">{String(row.email)}</p>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <StarRating value={Number(row.rating)} readOnly size={15} />
          <span className="text-xs text-gray-500">{Number(row.rating)}/5</span>
        </div>
      ),
    },
    {
      key: "ratedAt",
      header: "Date",
      sortable: false,
      render: (row) => (
        <span className="text-xs text-gray-400">
          {new Date(String(row.ratedAt)).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Here's how your stores are performing
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          <CardSkeleton /><CardSkeleton />
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title="No stores yet"
          description="Ask an administrator to assign a store to your account."
        />
      ) : (
        data.map((store) => {
          // Build rating distribution for this store
          const dist = [1, 2, 3, 4, 5].map((v) => ({
            name: `${v}★`,
            count: store.raters.filter((r) => r.rating === v).length,
          }));

          return (
            <div
              key={store.storeId}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              {/* Store header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {store.storeName}
                    </h2>
                    <p className="text-sm text-gray-400 truncate">{store.storeAddress}</p>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-2">
                      <StarRating value={store.averageRating} readOnly size={18} />
                      <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                        {store.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {store.totalRatings} rating{store.totalRatings !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Charts + table */}
              <div className="p-4 space-y-5">

                {/* Rating distribution chart — only show if there are ratings */}
                {store.totalRatings > 0 && (
                  <ChartCard title="Rating Distribution" loading={false}>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={dist} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" name="Ratings" radius={[4, 4, 0, 0]}>
                          {dist.map((_, i) => (
                            <Cell key={i} fill={STAR_COLORS[i]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}

                {/* Raters table */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                    Ratings received
                  </p>
                  {store.raters.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">No ratings yet for this store.</p>
                  ) : (
                    <Table<RaterRow>
                      columns={raterColumns}
                      data={store.raters as RaterRow[]}
                      emptyMessage="No ratings yet"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OwnerDashboard;
