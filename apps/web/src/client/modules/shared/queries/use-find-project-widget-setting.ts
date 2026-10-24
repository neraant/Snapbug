import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindProjectWidgetSetting(input: { projectId: string }) {
  return useSuspenseQuery(orpcQuery.project.findProjectWidgetSetting.queryOptions({ input }));
}
