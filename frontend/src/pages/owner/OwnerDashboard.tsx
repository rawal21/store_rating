import { usePageTitle } from "@/hooks/usePageTitle";
import { useOwnerDashboard } from "@/hooks/useOwnerDashboard";
import { useAuth } from "@/hooks/useAuth";
import StarRating from "@/components/shared/StarRating";
import Table, { type Column } from "@/components/ui/Table";
import { CardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/assets/svgs/EmptyState";

type RaterRow = {
  userId: string;
  name: string;
  email: string;
  rating: number;
  ratedAt: string;
} & Record<string, unknown>;

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
        data.map((store) => (
          <div
            key={store.storeId}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            {/* Store header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  {store.storeName}
                </h2>
                <p className="text-sm text-gray-400">{store.storeAddress}</p>
              </div>

              {/* Average rating */}
              <div className="flex flex-col items-start sm:items-end gap-1">
                <div className="flex items-center gap-2">
                  <StarRating value={store.averageRating} readOnly size={20} />
                  <span className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {store.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {store.totalRatings} rating{store.totalRatings !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Raters table */}
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Ratings received
              </p>
              {store.raters.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No ratings yet for this store.
                </p>
              ) : (
                <Table<RaterRow>
                  columns={raterColumns}
                  data={store.raters as RaterRow[]}
                  emptyMessage="No ratings yet"
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerDashboard;
