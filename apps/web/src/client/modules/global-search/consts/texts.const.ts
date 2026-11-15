import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  triggerLabel: "Open global search",
  dialogTitle: "Search",
  projectsHeading: "Projects",
  ticketsHeading: "Tickets",
  emptyQuery: "Type to search tickets and projects you can open.",
  emptyResults: "No tickets or projects match your search.",
  ticketMeta: (shortId: string, projectName: string) => `${shortId} · ${projectName}`,
} as const;

const ru = {
  triggerLabel: "Открыть глобальный поиск",
  dialogTitle: "Поиск",
  projectsHeading: "Проекты",
  ticketsHeading: "Тикеты",
  emptyQuery: "Введите запрос, чтобы найти доступные тикеты и проекты.",
  emptyResults: "Нет тикетов или проектов по вашему запросу.",
  ticketMeta: (shortId: string, projectName: string) => `${shortId} · ${projectName}`,
} as const;

export const texts: typeof en = localize(en, ru as never);