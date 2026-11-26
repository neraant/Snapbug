import { enUS, ru } from "date-fns/locale";

import { getInterfaceLanguage } from "@/client/modules/shared/locale/interface-language";

export function dateFnsLocale() {
  return getInterfaceLanguage() === "ru" ? ru : enUS;
}
