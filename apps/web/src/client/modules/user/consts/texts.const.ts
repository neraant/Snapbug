import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Interface language",
  description: "English and Russian. The dashboard uses the language you choose.",
  options: {
    en: "English",
    ru: "Русский",
  },
  save: "Save language",
  toast: {
    success: "Interface language saved",
    error: "Could not save the interface language. Try again.",
  },
} as const;

const ru = {
  title: "Язык интерфейса",
  description: "English и русский. Дашборд использует выбранный язык.",
  options: {
    en: "English",
    ru: "Русский",
  },
  save: "Сохранить язык",
  toast: {
    success: "Язык интерфейса сохранён",
    error: "Не удалось сохранить язык интерфейса. Попробуйте ещё раз.",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
