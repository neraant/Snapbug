"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { defaultMcpTab, type McpTab, mcpTabs, mcpTabSearchParamKey } from "@/client/modules/mcp/consts/mcp-tab.const";

function parseMcpTab(value: string | null): McpTab {
  if (value === mcpTabs.tools || value === mcpTabs.connect || value === mcpTabs.tokens) {
    return value;
  }

  return defaultMcpTab;
}

export function useMcpTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = parseMcpTab(searchParams.get(mcpTabSearchParamKey));

  const setTab = useCallback(
    (nextTab: McpTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(mcpTabSearchParamKey, nextTab);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { tab, setTab };
}
