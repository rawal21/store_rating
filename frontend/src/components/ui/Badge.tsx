interface BadgeProps {
  label: string;
  className?: string;
}

const Badge = ({ label, className = "" }: BadgeProps) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {label}
  </span>
);

export default Badge;
