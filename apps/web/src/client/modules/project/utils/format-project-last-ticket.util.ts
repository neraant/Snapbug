import { formatDistance } from "date-fns";

import { dateFnsLocale } from "@/client/modules/shared/locale/date-fns-locale.util";
import { getInterfaceLanguage } from "@/client/modules/shared/locale/interface-language";

export function formatProjectLastTicketRelative(lastTicketAt: string | null, noTicketsLabel: string): string {
  if (!lastTicketAt) {
    return noTicketsLabel;
  }

  return formatDistance(new Date(lastTicketAt), new Date(), { addSuffix: true, locale: dateFnsLocale() });
}

/** Calendar date that does not depend on "now", so SSR and the first client paint match. */
export function formatProjectLastTicketStable(lastTicketAt: string | null, noTicketsLabel: string): string {
  if (!lastTicketAt) {
    return noTicketsLabel;
  }

  const locale = getInterfaceLanguage() === "ru" ? "ru-RU" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(lastTicketAt));
}
