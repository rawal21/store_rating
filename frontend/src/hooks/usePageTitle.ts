import { useEffect } from "react";

/**
 * Custom hook — sets the document title.
 * Appended with the app name for consistency.
 */
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Store Rating`;
    return () => { document.title = "Store Rating"; };
  }, [title]);
};
