import { formatUserDate } from "@/client/modules/preference/utils/format-user-date.util";

export function formatActivityDate(createdAt: string, timeZone: string): string {
  return formatUserDate({ createdAt, timeZone, relative: true });
}