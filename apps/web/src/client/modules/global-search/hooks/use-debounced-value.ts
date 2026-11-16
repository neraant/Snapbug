import { useEffect, useState } from "react";

import { globalSearchDebounceMs } from "@/client/modules/global-search/consts/global-search.const";

export function useDebouncedValue<T>(value: T, delayMs: number = globalSearchDebounceMs): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, value]);

  return debouncedValue;
}