import styles from "./Table.module.css";
import type { SortOrder } from "@/types";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  /** Render prop — full control over cell rendering */
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortBy?: string;
  sortOrder?: SortOrder;
  onSort?: (key: string) => void;
  emptyMessage?: string;
  loading?: boolean;
  skeletonRows?: number;
}

const SortIcon = ({ active, order }: { active: boolean; order: SortOrder }) => (
  <span className={styles.sortIcon} aria-hidden="true">
    {!active ? "⇅" : order === "asc" ? "↑" : "↓"}
  </span>
);

/**
 * Generic sortable table.
 * Uses render props pattern for cell content — caller decides how each cell looks.
 */
function Table<T extends Record<string, unknown>>({
  columns,
  data,
  sortBy,
  sortOrder = "asc",
  onSort,
  emptyMessage = "No data found",
  loading = false,
  skeletonRows = 5,
}: TableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table} role="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={[styles.th, col.sortable ? styles.thSortable : ""].join(" ")}
                onClick={() => col.sortable && onSort?.(col.key)}
                aria-sort={
                  sortBy === col.key ? (sortOrder === "asc" ? "ascending" : "descending") : undefined
                }
              >
                {col.header}
                {col.sortable && (
                  <SortIcon active={sortBy === col.key} order={sortOrder} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            : data.length === 0
            ? (
                <tr>
                  <td colSpan={columns.length} className={styles.empty}>
                    {emptyMessage}
                  </td>
                </tr>
              )
            : data.map((row, i) => (
                <tr key={(row.id as string) ?? i} className={styles.tr}>
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
