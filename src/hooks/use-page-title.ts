import { useEffect } from "react";

const BASE_TITLE = "FANG & FLEECE";

export function usePageTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = `${title} — ${BASE_TITLE}`;
    } else {
      document.title = `${BASE_TITLE} — The Library`;
    }
    
    return () => {
      document.title = `${BASE_TITLE} — The Library`;
    };
  }, [title]);
}
