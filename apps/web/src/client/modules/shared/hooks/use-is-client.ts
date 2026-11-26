"use client";

import { useEffect, useState } from "react";

/** False during SSR and the first client render, then true. Keeps the first paint identical. */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
