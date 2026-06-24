import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import StarRating from "@/components/shared/StarRating";
import Badge from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { getRoleLabel, ROLE_COLORS } from "@/utils/roleLabel";
import { usersApi } from "@/api/users.api";
import { getErrorMessage } from "@/utils/apiError";
import type { IUser } from "@/types";

interface Props {
  userId: string | null;
  onClose: () => void;
}

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <div className="text-sm text-gray-800 dark:text-gray-200">{value}</div>
  </div>
);

const UserDetailModal = ({ userId, onClose }: Props) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setUser(null); return; }
    setLoading(true);
    setError(null);
    usersApi.getById(userId)
      .then((res) => setUser(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Modal open={!!userId} onClose={onClose} title="User Details" maxWidth="28rem">
      {loading ? (
        <div className="space-y-4 py-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-500 py-2">{error}</p>
      ) : user ? (
        <div className="space-y-4">

          {/* Header: name + role badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
                {user.name}
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            </div>
            <Badge label={getRoleLabel(user.role)} className={ROLE_COLORS[user.role]} />
          </div>

          {/* Core fields */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
            <Field label="Email"   value={user.email} />
            <Field label="Address" value={user.address} />
            <Field label="Role"    value={getRoleLabel(user.role)} />

            {/* ── STORE_OWNER section ── */}
            {user.role === "STORE_OWNER" && (
              <>
                {/* Assigned stores */}
                <div>
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">
                    Assigned Stores
                  </p>
                  {user.stores && user.stores.length > 0 ? (
                    <div className="space-y-1.5">
                      {user.stores.map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                        >
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {store.name}
                          </span>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">
                            {store.totalRatings} rating{store.totalRatings !== 1 ? "s" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800">
                      <svg className="w-4 h-4 text-yellow-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        No store assigned yet. Assign a store from the Stores page.
                      </p>
                    </div>
                  )}
                </div>

                {/* Average rating */}
                <div>
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                    Overall Store Rating
                  </p>
                  {user.averageRating !== undefined && user.averageRating > 0 ? (
                    <div className="flex items-center gap-2">
                      <StarRating value={user.averageRating} readOnly size={18} />
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
                        {user.averageRating.toFixed(1)}
                        <span className="text-gray-400 font-normal"> / 5</span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No ratings yet</span>
                  )}
                </div>
              </>
            )}

            <Field
              label="Member since"
              value={new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            />
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default UserDetailModal;
