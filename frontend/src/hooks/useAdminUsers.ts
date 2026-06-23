import { useState, useEffect, useCallback } from "react";
import { usersApi } from "@/api/users.api";
import { useToast } from "./useToast";
import { getErrorMessage } from "@/utils/apiError";
import type { IUser, UserFilters } from "@/types";

export const useAdminUsers = (filters: UserFilters) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll(filters);
      setUsers(res.data.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { users, loading, refetch: fetch };
};
