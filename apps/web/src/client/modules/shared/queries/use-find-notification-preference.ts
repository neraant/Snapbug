import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindNotificationPreference() {
  return useSuspenseQuery(orpcQuery.notification.findPreference.queryOptions());
}
