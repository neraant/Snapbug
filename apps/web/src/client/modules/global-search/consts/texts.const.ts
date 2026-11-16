import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  triggerLabel: "Open global search",
  dialogTitle: "Search",
  placeholder: "Search tickets and projects…",
  shortcutMac: "⌘K",
  shortcutWindows: "Ctrl K",
  clearQuery: "Clear search",
  projectsHeading: "Projects",
  ticketsHeading: "Tickets",
  recentHeading: "Recent",
  emptyQueryHint: "Type to search tickets and projects",
  noRecentHint: "Type to search tickets and projects",
  emptyResults: (query: string) => `No results for “${query}”`,
  emptyResultsHint: "Check the spelling or try a shorter query.",
  showAllTickets: "Show all in tickets →",
  showAllProjects: "Show all in projects →",
  footerHint: "↑↓ navigate · ↵ open · esc close",
  projectNavigate: (name: string) => `Open project ${name}`,
  ticketNavigate: (title: string) => `Open ticket ${title}`,
  statusLabels: {
    [BugReportStatus.NEW]: "New",
    [BugReportStatus.IN_PROGRESS]: "In progress",
    [BugReportStatus.RESOLVED]: "Resolved",
    [BugReportStatus.CLOSED]: "Closed",
  },
  severityLabels: {
    [BugReportSeverity.CRITICAL]: "Critical severity",
    [BugReportSeverity.HIGH]: "High severity",
    [BugReportSeverity.MEDIUM]: "Medium severity",
    [BugReportSeverity.LOW]: "Low severity",
  },
} as const;

const ru = {
  triggerLabel: "Открыть глобальный поиск",
  dialogTitle: "Поиск",
  placeholder: "Поиск тикетов и проектов…",
  shortcutMac: "⌘K",
  shortcutWindows: "Ctrl K",
  clearQuery: "Очистить поиск",
  projectsHeading: "Проекты",
  ticketsHeading: "Тикеты",
  recentHeading: "Недавние",
  emptyQueryHint: "Введите запрос для поиска тикетов и проектов",
  noRecentHint: "Введите запрос для поиска тикетов и проектов",
  emptyResults: (query: string) => `Нет результатов по запросу «${query}»`,
  emptyResultsHint: "Проверьте написание или сократите запрос.",
  showAllTickets: "Показать все в тикетах →",
  showAllProjects: "Показать все в проектах →",
  footerHint: "↑↓ навигация · ↵ открыть · esc закрыть",
  projectNavigate: (name: string) => `Открыть проект ${name}`,
  ticketNavigate: (title: string) => `Открыть тикет ${title}`,
  statusLabels: {
    [BugReportStatus.NEW]: "Новые",
    [BugReportStatus.IN_PROGRESS]: "В работе",
    [BugReportStatus.RESOLVED]: "Решено",
    [BugReportStatus.CLOSED]: "Закрыто",
  },
  severityLabels: {
    [BugReportSeverity.CRITICAL]: "Критическая важность",
    [BugReportSeverity.HIGH]: "Высокая важность",
    [BugReportSeverity.MEDIUM]: "Средняя важность",
    [BugReportSeverity.LOW]: "Низкая важность",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);