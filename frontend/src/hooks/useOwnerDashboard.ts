import { useState, useEffect, useCallback } from "react";
import { storesApi } from "@/api/stores.api";
import { useToast } from "./useToast";
import { getErrorMessage } from "@/utils/apiError";
import type { IOwnerDashboardStore } from "@/types";

/**
 * Custom hook — fetches store owner dashboard data.
 * Returns per-store stats and list of raters.
 */
export const useOwnerDashboard = () => {
  const [data, setData] = useState<IOwnerDashboardStore[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await storesApi.getOwnerDashboard();
      setData(res.data.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, loading, refetch: fetch };
};
