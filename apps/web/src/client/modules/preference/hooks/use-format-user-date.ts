import { useCallback } from "react";

import { formatUserDate } from "@/client/modules/preference/utils/format-user-date.util";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

export function useFormatUserDate() {
  const { data: preference } = useFindUserPreference();

  return useCallback(
    (createdAt: string) =>
      formatUserDate({
        createdAt,
        preference: {
          dateFormat: preference.dateFormat,
          timeZone: preference.timeZone,
          use24HourTime: preference.use24HourTime,
        },
      }),
    [preference.dateFormat, preference.timeZone, preference.use24HourTime],
  );
}
