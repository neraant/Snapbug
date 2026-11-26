import { formatDistanceToNow } from "date-fns";

import { dateFnsLocale } from "@/client/modules/shared/locale/date-fns-locale.util";
import { getInterfaceLanguage } from "@/client/modules/shared/locale/interface-language";

type FormatUserDateInput = {
  createdAt: string;
  timeZone: string;
  relative?: boolean;
  dateOnly?: boolean;
};

function resolveLocale(): string {
  return getInterfaceLanguage() === "ru" ? "ru-RU" : "en-US";
}

export function formatUserDate({ createdAt, timeZone, relative = false, dateOnly = false }: FormatUserDateInput): string {
  const date = new Date(createdAt);

  if (relative) {
    return formatDistanceToNow(date, { addSuffix: true, locale: dateFnsLocale() });
  }

  return new Intl.DateTimeFormat(resolveLocale(), {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(dateOnly ? {} : { hour: "numeric" as const, minute: "2-digit" as const }),
    timeZone,
  }).format(date);
}
