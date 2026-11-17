import { useCallback, useRef, useState } from "react";

export function useQuietSavedIndicator() {
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markSaved = useCallback((section: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSavedSection(section);
    timeoutRef.current = setTimeout(() => {
      setSavedSection(null);
      timeoutRef.current = null;
    }, 2500);
  }, []);

  const isSaved = useCallback((section: string) => savedSection === section, [savedSection]);

  return { markSaved, isSaved };
}
