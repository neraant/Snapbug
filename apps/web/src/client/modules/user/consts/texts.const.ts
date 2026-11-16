import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  sectionTitle: "Interface language",
  sectionDescription: "English and Russian. The dashboard uses the language you choose.",
  options: {
    en: "English",
    ru: "Русский",
  },
  saved: "Saved",
  toast: {
    error: "Could not save the interface language. Try again.",
  },
} as const;

const ru = {
  sectionTitle: "Язык интерфейса",
  sectionDescription: "English и русский. Дашборд использует выбранный язык.",
  options: {
    en: "English",
    ru: "Русский",
  },
  saved: "Сохранено",
  toast: {
    error: "Не удалось сохранить язык интерфейса. Попробуйте ещё раз.",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
