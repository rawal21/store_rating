import { useState } from "react";
import { ratingsApi } from "@/api/ratings.api";
import { useToast } from "./useToast";
import { getErrorMessage } from "@/utils/apiError";

/**
 * Custom hook — handles submit and update rating with loading state.
 * onSuccess callback lets the parent (store list) refresh the affected row.
 */
export const useRating = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submitRating = async (storeId: string, value: number) => {
    setLoading(true);
    try {
      await ratingsApi.create({ storeId, value });
      toast.success("Rating submitted!");
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const editRating = async (ratingId: string, value: number) => {
    setLoading(true);
    try {
      await ratingsApi.update(ratingId, value);
      toast.success("Rating updated!");
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { submitRating, editRating, loading };
};
