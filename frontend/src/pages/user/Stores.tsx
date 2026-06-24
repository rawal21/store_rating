import { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useDebounce } from "@/hooks/useDebounce";
import { useStores } from "@/hooks/useStores";
import { useAuth } from "@/hooks/useAuth";
import Table, { type Column } from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import StarRating from "@/components/shared/StarRating";
import RatingModal from "@/components/shared/RatingModal";
import Button from "@/components/ui/Button";
import type { IStore, SortOrder } from "@/types";

type StoreRow = IStore & Record<string, unknown>;

const PAGE_SIZE = 10;

const Stores = () => {
  usePageTitle("Stores");

  const { user } = useAuth();
  const isNormalUser = user?.role === "NORMAL_USER";

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  // Reset to page 1 on search/sort change
  const handleSort = (key: string) => {
    setSortOrder((prev) => (sortBy === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortBy(key);
    setPage(1);
  };

  const { stores, pagination, loading, refetch } = useStores({
    name: debouncedSearch || undefined,
    address: debouncedSearch || undefined,
    sortBy: sortBy as "name" | "email" | "address" | "createdAt",
    sortOrder,
    page,
    limit: PAGE_SIZE,
  });

  const [ratingModal, setRatingModal] = useState<{ open: boolean; store: IStore | null }>({ open: false, store: null });
  const openRating = (store: IStore) => setRatingModal({ open: true, store });
  const closeRating = () => setRatingModal({ open: false, store: null });

  const columns: Column<StoreRow>[] = [
    {
      key: "name",
      header: "Store Name",
      sortable: true,
      render: (row) => <span className="font-medium text-gray-900 dark:text-white">{String(row.name)}</span>,
    },
    {
      key: "address",
      header: "Address",
      sortable: true,
      render: (row) => <span className="text-gray-500 dark:text-gray-400 text-xs">{String(row.address)}</span>,
    },
    {
      key: "averageRating",
      header: "Overall Rating",
      sortable: false,
      render: (row) => {
        const avg = typeof row.averageRating === "number" ? row.averageRating : 0;
        const total = typeof row.totalRatings === "number" ? row.totalRatings : 0;
        return (
          <div className="flex items-center gap-1.5">
            <StarRating value={avg} readOnly size={16} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {avg.toFixed(1)}{total > 0 ? ` (${total})` : ""}
            </span>
          </div>
        );
      },
    },
    ...(isNormalUser ? [
      {
        key: "userRating",
        header: "Your Rating",
        sortable: false,
        render: (row: StoreRow) => {
          const val = typeof row.userRating === "number" ? row.userRating : null;
          return val
            ? <StarRating value={val} readOnly size={16} />
            : <span className="text-xs text-gray-400">Not rated</span>;
        },
      } satisfies Column<StoreRow>,
      {
        key: "actions",
        header: "Action",
        sortable: false,
        render: (row: StoreRow) => {
          const store = row as unknown as IStore;
          return (
            <Button variant={store.userRating ? "outline" : "primary"} size="sm" onClick={() => openRating(store)}>
              {store.userRating ? "Edit rating" : "Rate"}
            </Button>
          );
        },
      } satisfies Column<StoreRow>,
    ] : []),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Stores</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Browse and rate registered stores</p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or address…"
          className="w-full sm:w-72 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Search stores"
        />
      </div>

      <Table<StoreRow>
        columns={columns}
        data={stores as StoreRow[]}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        emptyMessage="No stores found"
      />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={setPage}
      />

      {ratingModal.store && (
        <RatingModal
          open={ratingModal.open}
          onClose={closeRating}
          storeId={ratingModal.store.id}
          storeName={ratingModal.store.name}
          existingRatingId={ratingModal.store.userRatingId}
          existingValue={ratingModal.store.userRating ?? 0}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default Stores;
