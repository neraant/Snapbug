"use client";

import { QueryClientProvider as TanStackQueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useState } from "react";

import { makeQueryClient } from "@/client/modules/shared/query-client/query-client";

export function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => makeQueryClient());

  return <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>;
}
