import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

type UseFindProjectApiKeyInput = {
  projectId: string;
};

export function useFindProjectApiKey(input: UseFindProjectApiKeyInput) {
  return useSuspenseQuery(orpcQuery.apiKey.findProjectApiKey.queryOptions({ input }));
}
