import { formatUserDate } from "@/client/modules/preference/utils/format-user-date.util";

export function formatTicketDetailWhen(occurredAt: string, timeZone: string): string {
  return formatUserDate({ createdAt: occurredAt, timeZone, relative: true });
}

export function formatTicketDetailExactWhen(occurredAt: string, timeZone: string): string {
  return formatUserDate({ createdAt: occurredAt, timeZone });
}
