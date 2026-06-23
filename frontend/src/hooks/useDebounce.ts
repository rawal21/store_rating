import { useState, useEffect } from "react";

/**
 * Custom hook — debounces a value by the given delay.
 * Used for search inputs to avoid firing an API call on every keystroke.
 */
export const useDebounce = <T>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
