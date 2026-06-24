import { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useToast } from "@/hooks/useToast";
import { usersApi } from "@/api/users.api";
import { getErrorMessage } from "@/utils/apiError";
import { getRoleLabel, ROLE_COLORS } from "@/utils/roleLabel";
import Table, { type Column } from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import CreateUserModal from "@/components/shared/CreateUserModal";
import UserDetailModal from "@/components/shared/UserDetailModal";
import type { IUser, Role, SortOrder } from "@/types";

type UserRow = IUser & Record<string, unknown>;

const PAGE_SIZE = 10;

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "ADMIN", label: "System Administrator" },
  { value: "NORMAL_USER", label: "Normal User" },
  { value: "STORE_OWNER", label: "Store Owner" },
];

const AdminUsers = () => {
  usePageTitle("Users");
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const debouncedSearch = useDebounce(search, 400);

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    setSortOrder((prev) => (sortBy === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortBy(key);
    setPage(1);
  };

  const { users, pagination, loading, refetch } = useAdminUsers({
    name: debouncedSearch || undefined,
    email: debouncedSearch || undefined,
    role: roleFilter || undefined,
    sortBy: sortBy as "name" | "email" | "address" | "role" | "createdAt",
    sortOrder,
    page,
    limit: PAGE_SIZE,
  });

  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await usersApi.delete(deleteTarget.id);
      toast.success("User deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState<string | null>(null);

  const columns: Column<UserRow>[] = [
    {
      key: "name",
      header: "Name",
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
      key: "role",
      header: "Role",
      sortable: true,
      render: (row) => {
        const role = row.role as Role;
        return <Badge label={getRoleLabel(role)} className={ROLE_COLORS[role]} />;
      },
    },
    {
      key: "actions",
      header: "",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setViewUserId(String(row.id))}>
            View
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row as unknown as IUser)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage platform users</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>+ Add User</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search name or email…"
          className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Select
          value={roleFilter}
          onChange={(v) => { setRoleFilter(v as Role | ""); setPage(1); }}
          options={ROLE_OPTIONS}
          placeholder="All Roles"
          className="w-full sm:w-48 shrink-0"
        />
      </div>

      <Table<UserRow>
        columns={columns}
        data={users as UserRow[]}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        emptyMessage="No users found"
      />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={setPage}
      />

      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={refetch} />
      <UserDetailModal userId={viewUserId} onClose={() => setViewUserId(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default AdminUsers;
