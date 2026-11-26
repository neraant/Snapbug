import { getInterfaceLanguage } from "@/client/modules/shared/locale/interface-language";

export function formatProjectCreatedDate(createdAt: string): string {
  const locale = getInterfaceLanguage() === "ru" ? "ru-RU" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(createdAt));
}
