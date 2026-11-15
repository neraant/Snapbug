import { useQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

type UseSearchInput = {
  query: string;
  enabled: boolean;
};

export function useSearch({ query, enabled }: UseSearchInput) {
  return useQuery(
    orpcQuery.search.search.queryOptions({
      input: { query },
      enabled: enabled && query.trim().length > 0,
    }),
  );
}