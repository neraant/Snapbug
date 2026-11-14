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
    description: "Preview the Snapbug widget.",
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
    description: "Предпросмотр виджета Snapbug.",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
