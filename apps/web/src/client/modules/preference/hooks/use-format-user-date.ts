import { useCallback } from "react";

import { formatUserDate } from "@/client/modules/preference/utils/format-user-date.util";
import { useIsClient } from "@/client/modules/shared/hooks/use-is-client";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

export function useFormatUserDate() {
  const { data: preference } = useFindUserPreference();
  const isClient = useIsClient();

  return useCallback(
    (createdAt: string, options?: { relative?: boolean; dateOnly?: boolean }) =>
      formatUserDate({
        createdAt,
        timeZone: preference.timeZone,
        relative: Boolean(options?.relative) && isClient,
        dateOnly: options?.dateOnly,
      }),
    [isClient, preference.timeZone],
  );
}
