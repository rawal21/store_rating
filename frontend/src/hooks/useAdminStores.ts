import { useState, useEffect, useCallback } from "react";
import { storesApi } from "@/api/stores.api";
import { useToast } from "./useToast";
import { getErrorMessage } from "@/utils/apiError";
import type { IStore, StoreFilters } from "@/types";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useAdminStores = (filters: StoreFilters) => {
  const [stores, setStores] = useState<IStore[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await storesApi.getAll(filters);
      const result = res.data.data;
      setStores(result.data);
      setPagination({ total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { stores, pagination, loading, refetch: fetch };
};
