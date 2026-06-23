import type { Role } from "@/types";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "System Administrator",
  NORMAL_USER: "Normal User",
  STORE_OWNER: "Store Owner",
};

export const getRoleLabel = (role: Role): string => ROLE_LABELS[role] ?? role;

export const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  NORMAL_USER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  STORE_OWNER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};
