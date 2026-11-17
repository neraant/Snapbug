import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";

import { formatUserDate } from "@/client/modules/preference/utils/format-user-date.util";

type TicketDetailDatePreference = Pick<UserPreferenceModelType, "dateFormat" | "timeZone" | "use24HourTime">;

export function formatTicketDetailWhen(occurredAt: string, preference: TicketDetailDatePreference): string {
  return formatUserDate({ createdAt: occurredAt, preference });
}

export function formatTicketDetailExactWhen(occurredAt: string, preference: TicketDetailDatePreference): string {
  return formatUserDate({
    createdAt: occurredAt,
    preference: { ...preference, dateFormat: "absolute" },
  });
}
