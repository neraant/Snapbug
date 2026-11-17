import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { userPreferenceDefaults } from "@workspace/validation/modules/preference/dto/user-preference.model";

import { formatUserDate } from "@/client/modules/preference/utils/format-user-date.util";

export function formatActivityDate(
  createdAt: string,
  preference: Pick<UserPreferenceModelType, "dateFormat" | "timeZone" | "use24HourTime"> = {
    dateFormat: userPreferenceDefaults.dateFormat,
    timeZone: userPreferenceDefaults.timeZone,
    use24HourTime: userPreferenceDefaults.use24HourTime,
  },
): string {
  return formatUserDate({ createdAt, preference });
}
