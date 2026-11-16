import { useQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindMcpTools() {
  return useQuery(orpcQuery.mcp.listTools.queryOptions());
}
