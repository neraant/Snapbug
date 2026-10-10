import { useCallback, useEffect, useRef, useState } from "react";

type UseCopyTextOptions = {
  resetAfterMs?: number;
};

export function useCopyText(options: UseCopyTextOptions = {}) {
  const { resetAfterMs = 1500 } = options;
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        timeoutRef.current = window.setTimeout(() => {
          setCopied(false);
          timeoutRef.current = null;
        }, resetAfterMs);
      } catch {
        setCopied(false);
      }
    },
    [resetAfterMs],
  );

  return { copied, copy };
}
