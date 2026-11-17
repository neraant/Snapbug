import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  saved: "Saved",
  toast: {
    error: "Could not save your preferences. Try again.",
  },
  theme: {
    sectionTitle: "Theme",
    sectionDescription: "Light, dark, or match your system.",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  accent: {
    sectionTitle: "Accent color",
    sectionDescription: "Applied to primary buttons, links, and focus rings.",
    swatchLabel: (color: string) => `Accent ${color}`,
  },
  density: {
    sectionTitle: "Density",
    sectionDescription: "Comfortable rows or tighter table spacing.",
    comfortable: "Comfortable",
    compact: "Compact",
  },
  dateFormat: {
    sectionTitle: "Date and time",
    sectionDescription: "How timestamps appear across the app.",
    formatLabel: "Date format",
    relative: "Relative",
    absolute: "Absolute",
    use24Hour: "24-hour time",
  },
  reduceMotion: {
    sectionTitle: "Reduce motion",
    sectionDescription: "Limits non-essential animation. Defaults to your OS setting.",
    label: "Reduce motion",
    useSystem: "Use system setting",
    followsSystem: "Following system preference",
  },
  landingPage: {
    sectionTitle: "Default landing page",
    sectionDescription: "Where home redirects after sign-in.",
    overview: "Overview",
    tickets: "Tickets",
  },
  sidebar: {
    sectionTitle: "Sidebar",
    sectionDescription: "Start with the sidebar collapsed on wide screens.",
    collapsed: "Start collapsed",
  },
  preview: {
    title: "Preview",
    description: "Sample ticket row and primary button in your current choices.",
    ticketTitle: "Checkout button missing on mobile",
    ticketMeta: "Open · High",
    button: "Primary action",
  },
} as const;

const ru = {
  saved: "Сохранено",
  toast: {
    error: "Не удалось сохранить настройки. Попробуйте ещё раз.",
  },
  theme: {
    sectionTitle: "Тема",
    sectionDescription: "Светлая, тёмная или как в системе.",
    light: "Светлая",
    dark: "Тёмная",
    system: "Системная",
  },
  accent: {
    sectionTitle: "Акцентный цвет",
    sectionDescription: "Для основных кнопок, ссылок и фокуса.",
    swatchLabel: (color: string) => `Акцент ${color}`,
  },
  density: {
    sectionTitle: "Плотность",
    sectionDescription: "Обычные строки или более компактные таблицы.",
    comfortable: "Обычная",
    compact: "Компактная",
  },
  dateFormat: {
    sectionTitle: "Дата и время",
    sectionDescription: "Как показываются метки времени в приложении.",
    formatLabel: "Формат даты",
    relative: "Относительный",
    absolute: "Абсолютный",
    use24Hour: "24-часовой формат",
  },
  reduceMotion: {
    sectionTitle: "Уменьшить анимацию",
    sectionDescription: "Отключает лишние анимации. По умолчанию — как в ОС.",
    label: "Уменьшить анимацию",
    useSystem: "Как в системе",
    followsSystem: "Следует настройке системы",
  },
  landingPage: {
    sectionTitle: "Стартовая страница",
    sectionDescription: "Куда ведёт главная после входа.",
    overview: "Обзор",
    tickets: "Тикеты",
  },
  sidebar: {
    sectionTitle: "Боковая панель",
    sectionDescription: "Сворачивать панель на широких экранах при входе.",
    collapsed: "Свёрнутая при старте",
  },
  preview: {
    title: "Превью",
    description: "Пример строки тикета и основной кнопки с текущими настройками.",
    ticketTitle: "Нет кнопки оформления на мобильном",
    ticketMeta: "Открыт · Высокий",
    button: "Основное действие",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
