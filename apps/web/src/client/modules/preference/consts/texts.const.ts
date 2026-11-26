import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  saved: "Saved",
  toast: {
    error: "Could not save your preferences. Try again.",
  },
  language: {
    sectionTitle: "Interface language",
    sectionDescription: "English and Russian. The dashboard uses the language you choose.",
    options: {
      en: "English",
      ru: "Русский",
    },
    toast: {
      error: "Could not save the interface language. Try again.",
    },
  },
  theme: {
    sectionTitle: "Theme",
    sectionDescription: "Light, dark, or match your system.",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
} as const;

const ru = {
  saved: "Сохранено",
  toast: {
    error: "Не удалось сохранить настройки. Попробуйте ещё раз.",
  },
  language: {
    sectionTitle: "Язык интерфейса",
    sectionDescription: "Английский и русский. Интерфейс использует выбранный язык.",
    options: {
      en: "Английский",
      ru: "Русский",
    },
    toast: {
      error: "Не удалось сохранить язык интерфейса. Попробуйте ещё раз.",
    },
  },
  theme: {
    sectionTitle: "Тема",
    sectionDescription: "Светлая, тёмная или как в системе.",
    light: "Светлая",
    dark: "Тёмная",
    system: "Системная",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
