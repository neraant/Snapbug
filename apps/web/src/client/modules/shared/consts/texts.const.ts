import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  signOut: {
    label: "Sign out",
  },
  header: {
    search: "Search tickets, URLs, stack traces...",
    searchShortcut: "⌘K",
    notifications: "Notifications",
    breadcrumb: "Breadcrumb",
  },
  overview: {
    title: "Overview",
    description: "Diagnostic analytics, bug arrival rates, and engineering team resolution throughput.",
  },
  playground: {
    title: "Playground",
    description: "A sample customer page. Submit stays here and shows the capture.",
  },
  confirm: {
    cancel: "Cancel",
    error: "Something went wrong. Try again.",
    typeToConfirm: {
      prefix: "Type",
      suffix: "to confirm",
    },
  },
} as const;

const ru = {
  signOut: {
    label: "Выйти",
  },
  header: {
    search: "Поиск тикетов, URL и стектрейсов...",
    searchShortcut: "⌘K",
    notifications: "Уведомления",
    breadcrumb: "Навигационная цепочка",
  },
  overview: {
    title: "Обзор",
    description: "Диагностика, частота новых багов и скорость их закрытия командой.",
  },
  playground: {
    title: "Песочница",
    description: "Пример страницы клиента. Отправка остаётся на этой странице и показывает захват.",
  },
  confirm: {
    cancel: "Отмена",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
    typeToConfirm: {
      prefix: "Введите",
      suffix: "для подтверждения",
    },
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
