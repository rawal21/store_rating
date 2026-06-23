interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => (
  <span
    role="status"
    aria-label="Loading"
    className={`inline-block border-2 border-current border-t-transparent rounded-full animate-spin text-primary-600 ${sizeMap[size]} ${className}`}
  />
);

export default Spinner;
