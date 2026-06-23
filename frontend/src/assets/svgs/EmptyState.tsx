interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState = ({
  title = "Nothing here yet",
  description = "There's no data to display.",
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <svg
      className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-4"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.3" />
      <rect x="65" y="75" width="70" height="55" rx="6" fill="currentColor" opacity="0.6" />
      <rect x="78" y="90" width="45" height="6" rx="3" fill="white" opacity="0.7" />
      <rect x="78" y="103" width="30" height="6" rx="3" fill="white" opacity="0.5" />
      <circle cx="100" cy="148" r="10" fill="currentColor" opacity="0.6" />
    </svg>
    <h3 className="text-base font-semibold text-gray-600 dark:text-gray-400">{title}</h3>
    <p className="text-sm text-gray-400 dark:text-gray-600 mt-1 max-w-xs">{description}</p>
  </div>
);

export default EmptyState;
