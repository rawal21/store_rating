import { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminStores } from "@/hooks/useAdminStores";
import { useToast } from "@/hooks/useToast";
import { storesApi } from "@/api/stores.api";
import { getErrorMessage } from "@/utils/apiError";
import Table, { type Column } from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import StarRating from "@/components/shared/StarRating";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import CreateStoreModal from "@/components/shared/CreateStoreModal";
import type { IStore, SortOrder } from "@/types";

type StoreRow = IStore & Record<string, unknown>;

const PAGE_SIZE = 10;

const AdminStores = () => {
  usePageTitle("Stores");
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const debouncedEmail  = useDebounce(emailFilter, 400);

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    setSortOrder((prev) => (sortBy === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortBy(key);
    setPage(1);
  };

  const { stores, pagination, loading, refetch } = useAdminStores({
    name:    debouncedSearch || undefined,
    address: debouncedSearch || undefined,
    email:   debouncedEmail  || undefined,
    sortBy:  sortBy as "name" | "email" | "address" | "createdAt",
    sortOrder,
    page,
    limit: PAGE_SIZE,
  });

  const [deleteTarget, setDeleteTarget] = useState<IStore | null>(null);
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await storesApi.delete(deleteTarget.id);
      toast.success("Store deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const [createOpen, setCreateOpen] = useState(false);

  const columns: Column<StoreRow>[] = [
    {
      key: "name",
      header: "Store Name",
      sortable: true,
      render: (row) => <span className="font-medium text-gray-900 dark:text-white">{String(row.name)}</span>,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (row) => <span className="text-gray-500 dark:text-gray-400 text-sm">{String(row.email)}</span>,
    },
    {
      key: "address",
      header: "Address",
      sortable: true,
      render: (row) => <span className="text-gray-500 dark:text-gray-400 text-xs">{String(row.address)}</span>,
    },
    {
      key: "averageRating",
      header: "Rating",
      sortable: false,
      render: (row) => {
        const avg = typeof row.averageRating === "number" ? row.averageRating : 0;
        const total = typeof row.totalRatings === "number" ? row.totalRatings : 0;
        return (
          <div className="flex items-center gap-1.5">
            <StarRating value={avg} readOnly size={15} />
            <span className="text-xs text-gray-500">{avg.toFixed(1)}{total > 0 ? ` (${total})` : ""}</span>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "",
      sortable: false,
      render: (row) => (
        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row as unknown as IStore)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Stores</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage registered stores</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>+ Add Store</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search name or address…"
          className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
        />
        <input
          type="search"
          value={emailFilter}
          onChange={(e) => { setEmailFilter(e.target.value); setPage(1); }}
          placeholder="Filter by email…"
          className="w-full sm:w-52 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
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

      <CreateStoreModal open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={refetch} />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Store"
        message={`Delete "${deleteTarget?.name}"? All ratings for this store will also be removed.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default AdminStores;
