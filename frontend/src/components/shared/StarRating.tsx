import { useState } from "react";

interface StarRatingProps {
  value: number;           // current value (0-5)
  onChange?: (v: number) => void; // if provided, component is interactive
  size?: number;
  readOnly?: boolean;
}

/**
 * SVG star rating — works in both read-only and interactive mode.
 * Uses controlled pattern when onChange is provided.
 */
const StarRating = ({ value, onChange, size = 20, readOnly = false }: StarRatingProps) => {
  const [hovered, setHovered] = useState(0);
  const display = readOnly ? value : (hovered || value);

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            role={readOnly ? undefined : "radio"}
            aria-checked={readOnly ? undefined : value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            className={`transition-transform ${!readOnly ? "hover:scale-110 cursor-pointer" : "cursor-default"} bg-transparent border-none p-0`}
            style={{ width: size, height: size }}
          >
            {/* SVG star */}
            <svg
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill={filled ? "#f59e0b" : "none"}
              stroke={filled ? "#f59e0b" : "#d1d5db"}
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
