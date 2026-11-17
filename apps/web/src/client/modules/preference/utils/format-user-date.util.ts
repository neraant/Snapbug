import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { formatDistanceToNow } from "date-fns";

type FormatUserDateInput = {
  createdAt: string;
  preference: Pick<UserPreferenceModelType, "dateFormat" | "timeZone" | "use24HourTime">;
};

export function formatUserDate({ createdAt, preference }: FormatUserDateInput): string {
  const date = new Date(createdAt);

  if (preference.dateFormat === "relative") {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: !preference.use24HourTime,
    timeZone: preference.timeZone,
  }).format(date);
}
