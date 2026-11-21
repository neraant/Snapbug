import { getInterfaceLanguage } from "@/client/modules/shared/locale/interface-language";
import { formatDistanceToNow } from "date-fns";

type FormatUserDateInput = {
  createdAt: string;
  timeZone: string;
  relative?: boolean;
};

function resolveLocale(): string {
  return getInterfaceLanguage() === "ru" ? "ru-RU" : "en-US";
}

export function formatUserDate({ createdAt, timeZone, relative = false }: FormatUserDateInput): string {
  const date = new Date(createdAt);

  if (relative) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return new Intl.DateTimeFormat(resolveLocale(), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(date);
}