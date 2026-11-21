import { useCallback } from "react";

import { formatUserDate } from "@/client/modules/preference/utils/format-user-date.util";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

export function useFormatUserDate() {
  const { data: preference } = useFindUserPreference();

  return useCallback(
    (createdAt: string, options?: { relative?: boolean }) =>
      formatUserDate({
        createdAt,
        timeZone: preference.timeZone,
        relative: options?.relative,
      }),
    [preference.timeZone],
  );
}