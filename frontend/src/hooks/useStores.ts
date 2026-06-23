import { useState, useEffect, useCallback } from "react";
import { storesApi } from "@/api/stores.api";
import { useToast } from "./useToast";
import { getErrorMessage } from "@/utils/apiError";
import type { IStore, StoreFilters } from "@/types";

/**
 * Custom hook — fetches and manages the store list with filters + sorting.
 * Exposes refetch so rating changes can trigger a fresh load.
 */
export const useStores = (filters: StoreFilters) => {
  const [stores, setStores] = useState<IStore[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await storesApi.getAll(filters);
      setStores(res.data.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { stores, loading, refetch: fetch };
};
