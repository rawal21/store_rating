interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, total, limit, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build page numbers to show: always first, last, current ± 1, with ellipsis
  const pages: (number | "...")[] = [];
  const delta = 1;
  const left = page - delta;
  const right = page + delta;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const btnBase =
    "inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors";
  const active = `${btnBase} bg-primary-600 text-white`;
  const inactive = `${btnBase} text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`;
  const disabled = `${btnBase} text-gray-300 dark:text-gray-600 cursor-not-allowed`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-200">{from}–{to}</span> of{" "}
        <span className="font-medium text-gray-700 dark:text-gray-200">{total}</span> results
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          className={page === 1 ? disabled : inactive}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          ←
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-400 select-none">…</span>
          ) : (
            <button
              key={p}
              className={p === page ? active : inactive}
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          className={page === totalPages ? disabled : inactive}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
