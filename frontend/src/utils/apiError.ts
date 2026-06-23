import { isAxiosError } from "axios";

/**
 * Extracts a human-readable error message from any thrown value.
 */
export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? "Something went wrong";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};
