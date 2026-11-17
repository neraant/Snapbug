import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";

import {
  formatTicketDetailExactWhen,
  formatTicketDetailWhen,
} from "@/client/modules/ticket-detail/utils/format-ticket-detail-timestamp.util";

type TicketDetailCommentDatePreference = Pick<UserPreferenceModelType, "dateFormat" | "timeZone" | "use24HourTime">;

export function formatTicketDetailCommentWhen(isoDate: string, preference: TicketDetailCommentDatePreference): string {
  return formatTicketDetailWhen(isoDate, preference);
}

export function formatTicketDetailCommentExactWhen(
  isoDate: string,
  preference: TicketDetailCommentDatePreference,
): string {
  return formatTicketDetailExactWhen(isoDate, preference);
}
